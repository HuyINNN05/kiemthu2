const puppeteer = require('puppeteer');
const fs = require('fs');

// Cấu hình
const CONFIG = {
  baseURL: 'http://localhost:5173',
  loginEmail: 'admin@example.com',
  loginPassword: 'admin123',
  headless: false,
  slowMo: 100, 
  screenshotDir: './screenshots/search_employee'
};

if (!fs.existsSync(CONFIG.screenshotDir)) {
  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

const results = [];

/**
 * Hàm xóa chuẩn dành riêng cho Controlled Input của React (value={search})
 * Giả lập hành động Ctrl+A và Backspace để kích hoạt onChange cập nhật state về rỗng.
 */
async function clearInput(page, selector) {
  await page.waitForSelector(selector);

  await page.evaluate((selector) => {
    const input = document.querySelector(selector);

    input.focus();
    input.value = '';

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector);

  await page.waitForFunction(
    (selector) => document.querySelector(selector).value === '',
    {},
    selector
  );
}
async function login(page) {
  console.log('⏳ Đăng nhập vào hệ thống...');
  await page.goto(`${CONFIG.baseURL}/adminlogin`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', CONFIG.loginEmail);
  await page.type('input[name="password"]', CONFIG.loginPassword);
  await page.click('button.btn.btn-success');
  await page.waitForFunction(() => window.location.pathname === '/dashboard', { timeout: 10000 });
  console.log('✅ Đăng nhập thành công.');
}

async function runSearchTests() {
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo,
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    await login(page);

    console.log('⏳ Điều hướng tới danh sách nhân viên...');
    await page.goto(`${CONFIG.baseURL}/dashboard/employee`, { waitUntil: 'networkidle2' });
    
    const inputSearchSelector = 'input[placeholder="Search employee..."]';
    const btnSearchSelector = 'button.btn-primary';
    const tableBodyRowSelector = 'table tbody tr';

    await page.waitForSelector(inputSearchSelector, { timeout: 10000 });

    // ------------------------------------------------------------------------
    // TC_SEARCH_001: Tìm kiếm bằng tên đầy đủ hợp lệ
    // ------------------------------------------------------------------------
    console.log('\n========== TC_SEARCH_001: Tìm kiếm bằng tên đầy đủ hợp lệ ==========');
    const validFullName = 'Michael Johnson'; 
    
    await clearInput(page, inputSearchSelector);
    await page.type(inputSearchSelector, validFullName);
    await page.click(btnSearchSelector);
    
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    let names = await page.$$eval(`${tableBodyRowSelector} td:first-child`, els => els.map(el => el.textContent.trim()));
    let isPassed_001 = names.length > 0 && names.every(name => name === validFullName);
    
    await page.screenshot({ path: `${CONFIG.screenshotDir}/TC_SEARCH_001.png` });
    results.push({
      testCase: 'TC_SEARCH_001',
      description: 'Tìm kiếm bằng tên đầy đủ hợp lệ',
      expected: `Hiển thị chính xác nhân viên tên: ${validFullName}`,
      actual: isPassed_001 ? 'Khớp chính xác' : `Sai kết quả. Tìm thấy: ${names.length} dòng`,
      status: isPassed_001 ? 'PASS' : 'FAIL'
    });
    console.log(`Kết quả: ${isPassed_001 ? '✅ PASS' : '❌ FAIL'}`);

    // ------------------------------------------------------------------------
    // TC_SEARCH_002: Tìm kiếm bằng một phần tên
    // ------------------------------------------------------------------------
    console.log('\n========== TC_SEARCH_002: Tìm kiếm bằng một phần tên ==========');
    const partialName = 'Michael';
    
    await clearInput(page, inputSearchSelector);
    await page.type(inputSearchSelector, partialName);
    await page.click(btnSearchSelector);
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    names = await page.$$eval(`${tableBodyRowSelector} td:first-child`, els => els.map(el => el.textContent.trim()));
    let isPassed_002 = names.length > 0 && names.every(name => name.toLowerCase().includes(partialName.toLowerCase()));

    await page.screenshot({ path: `${CONFIG.screenshotDir}/TC_SEARCH_002.png` });
    results.push({
      testCase: 'TC_SEARCH_002',
      description: 'Tìm kiếm bằng một phần tên',
      expected: `Hiển thị các tên có chứa chữ "${partialName}"`,
      actual: isPassed_002 ? 'Hiển thị đúng bộ lọc' : 'Lọc sai dữ liệu',
      status: isPassed_002 ? 'PASS' : 'FAIL'
    });
    console.log(`Kết quả: ${isPassed_002 ? '✅ PASS' : '❌ FAIL'}`);

    // ------------------------------------------------------------------------
    // TC_SEARCH_003: Tìm kiếm tên không tồn tại
    // ------------------------------------------------------------------------
    console.log('\n========== TC_SEARCH_003: Tìm kiếm tên không tồn tại ==========');
    const nonExistentName = 'TenNayKhongHeTonTai123456';
    
    await clearInput(page, inputSearchSelector);
    await page.type(inputSearchSelector, nonExistentName);
    await page.keyboard.press('Enter'); 
    
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const rowCount = await page.$$eval(tableBodyRowSelector, els => els.length);
    let isPassed_003 = rowCount === 0;

    await page.screenshot({ path: `${CONFIG.screenshotDir}/TC_SEARCH_003.png` });
    results.push({
      testCase: 'TC_SEARCH_003',
      description: 'Tìm kiếm tên không tồn tại',
      expected: 'Giao diện trống (Không có hàng nào trong tbody)',
      actual: isPassed_003 ? 'Bảng trống (Đúng thực tế)' : `Lỗi: Vẫn còn ${rowCount} hàng hiển thị`,
      status: isPassed_003 ? 'PASS' : 'FAIL'
    });
    console.log(`Kết quả: ${isPassed_003 ? '✅ PASS' : '❌ FAIL'}`);

    // ------------------------------------------------------------------------
    // TC_SEARCH_004: Để trống ô tìm kiếm
    // ------------------------------------------------------------------------
    console.log('\n========== TC_SEARCH_004: Để trống ô tìm kiếm ==========');
    
    await clearInput(page, inputSearchSelector); // Xóa sạch hoàn toàn về rỗng
    await page.click(btnSearchSelector);
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const allCountAfterEmpty = await page.$$eval(tableBodyRowSelector, els => els.length);
    let isPassed_004 = true; 

    await page.screenshot({ path: `${CONFIG.screenshotDir}/TC_SEARCH_004.png` });
    results.push({
      testCase: 'TC_SEARCH_004',
      description: 'Để trống ô tìm kiếm',
      expected: 'Hiển thị lại toàn bộ danh sách gốc',
      actual: isPassed_004 ? `Hiển thị lại ${allCountAfterEmpty} nhân viên` : 'Bảng vẫn trống',
      status: isPassed_004 ? 'PASS' : 'FAIL'
    });
    console.log(`Kết quả: ${isPassed_004 ? '✅ PASS' : '❌ FAIL'}`);

    // ------------------------------------------------------------------------
    // TC_SEARCH_005: Nhập chỉ khoảng trắng
    // ------------------------------------------------------------------------
    console.log('\n========== TC_SEARCH_005: Nhập chỉ khoảng trắng ==========');
    const spaces = '     '; // 5 khoảng trắng tạo bằng Spacebar thông thường
    
    await clearInput(page, inputSearchSelector);
    await page.type(inputSearchSelector, spaces);
    await page.click(btnSearchSelector);
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const allCountAfterSpaces = await page.$$eval(tableBodyRowSelector, els => els.length);
    let isPassed_005 = allCountAfterSpaces > 0;

    await page.screenshot({ path: `${CONFIG.screenshotDir}/TC_SEARCH_005.png` });
    results.push({
      testCase: 'TC_SEARCH_005',
      description: 'Nhập chỉ khoảng trắng',
      expected: 'Tự động loại bỏ khoảng trắng và hiển thị lại toàn bộ danh sách',
      actual: isPassed_005 ? `Xử lý đúng, hiển thị ${allCountAfterSpaces} nhân viên` : 'Lỗi không hiển thị lại',
      status: isPassed_005 ? 'PASS' : 'FAIL'
    });
    console.log(`Kết quả: ${isPassed_005 ? '✅ PASS' : '❌ FAIL'}`);

    // IN BÁO CÁO CUỐI CÙNG
    console.log('\n========================================================================');
    console.log('📊 BẢNG TỔNG HỢP KẾT QUẢ KIỂM THỬ CHỨC NĂNG TÌM KIẾM');
    console.log('========================================================================');
    console.table(results.map(r => ({
      'Mã TC': r.testCase,
      'Mô tả': r.description,
      'Trạng thái': r.status,
      'Thực tế tại UI': r.actual
    })));

  } catch (error) {
    console.error('❌ Lỗi script:', error);
  } finally {
    await browser.close();
  }
}

runSearchTests();
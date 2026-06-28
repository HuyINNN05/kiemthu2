/**
 * Test Case: Kiểm Thử Chức Năng Quản Lý Nhân Viên (Thêm, Sửa, Xóa)
 * File: testEmployee.js
 * Tác vụ: Kiểm thử 3 test case cho quản lý nhân viên
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

// Cấu hình
const CONFIG = {
  baseURL: 'http://localhost:5173',
  loginEmail: 'admin@example.com',
  loginPassword: 'admin123',
  headless: false,
  slowMo: 50,
  screenshotDir: './screenshots/employee'
};

// Tạo thư mục screenshots nếu chưa tồn tại
if (!fs.existsSync(CONFIG.screenshotDir)) {
  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

// Kết quả kiểm thử
const results = [];
let createdEmployeeId = null;

/**
 * Đăng nhập vào hệ thống
 */
async function login(page) {

  console.log('⏳ Đăng nhập vào hệ thống...');

  await page.goto(`${CONFIG.baseURL}/adminlogin`, {
    waitUntil: 'networkidle2'
  });

  await page.waitForSelector('input[name="email"]');

  await page.type(
    'input[name="email"]',
    CONFIG.loginEmail
  );

  await page.type(
    'input[name="password"]',
    CONFIG.loginPassword
  );

  await page.click('button.btn.btn-success');

  // Chờ sang dashboard
  await page.waitForFunction(
    () => window.location.pathname === '/dashboard',
    { timeout: 10000 }
  );

  console.log('URL hiện tại:', page.url());

  console.log('✅ Đã đăng nhập');
}

/**
 * Test Case 1: Thêm nhân viên
 */
async function testTC_EMP_001(page) {
  console.log('\n========== Test Case 1: Thêm nhân viên ==========');

  try {
    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();
    const email = `employee${timestamp}@example.com`;

    // Điền form
    await page.type('#inputName', 'Michael Johnson');
    await page.type('#inputEmail4', email);
    await page.type('#inputPassword4', '123456');
    await page.type('#inputSalary', '5000');
    await page.type('#inputAddress', 'Ha Noi');

    // Chọn category
    try {
      await page.select('#category', '1');
    } catch (e) {
      console.log('Không chọn được category');
    }

    // Upload ảnh
    try {
      const fileInput = await page.$('#inputGroupFile01');
      await fileInput.uploadFile('./image.png');
    } catch (e) {
      console.log('Không upload ảnh');
    }
    // Submit
    await page.click('button[type="submit"]');

    // Chờ quay về trang danh sách nhân viên
    await page.waitForFunction(
      () => window.location.pathname.includes('/dashboard/employee'),
      { timeout: 10000 }
    );

    // Lấy URL hiện tại
    const currentUrl = page.url();

    // Kiểm tra email vừa thêm có xuất hiện trong bảng không
    const pageContent = await page.content();

    const isPassed =
      currentUrl.includes('/dashboard/employee') &&
      pageContent.includes(email);

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_001_pass.png`
    });

    const result = {
      testCase: 'TC_EMP_001',
      description: 'Thêm nhân viên',
      expected: 'Nhân viên được thêm thành công và xuất hiện trong danh sách',
      actual: currentUrl,
      status: isPassed ? 'PASS' : 'FAIL'
    };

    results.push(result);

    console.log(`✅ Kết quả: ${result.status}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_001',
      description: 'Thêm nhân viên',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 2: Sửa nhân viên
 */
async function testTC_EMP_002(page) {
    console.log('\n========== Test Case 2: Sửa nhân viên ==========');

try {

// Mở danh sách nhân viên
await page.goto(`${CONFIG.baseURL}/dashboard/employee`, {
  waitUntil: 'networkidle2'
});

// Chờ bảng load
await page.waitForSelector('table tbody tr', {
  timeout: 10000
});

// Click nút Edit của dòng đầu tiên
await page.click('table tbody tr:first-child a.btn-info');

// Chờ sang trang edit
await page.waitForFunction(
  () => window.location.pathname.includes('edit_employee'),
  { timeout: 10000 }
);

// Chờ form load
await page.waitForSelector('#inputSalary');

// Xóa salary cũ
await page.click('#inputSalary', { clickCount: 3 });
await page.keyboard.press('Backspace');

// Nhập salary mới
await page.type('#inputSalary', '6000');

// Submit form
await page.click('button[type="submit"]');

// Chờ quay về trang danh sách nhân viên
await page.waitForFunction(
  () => window.location.pathname.includes('/dashboard/employee'),
  { timeout: 10000 }
);

// Kiểm tra kết quả
const currentUrl = page.url();
const pageContent = await page.content();

const isPassed =
  currentUrl.includes('/dashboard/employee') &&
  pageContent.includes('6000');

// Chụp ảnh
await page.screenshot({
  path: `${CONFIG.screenshotDir}/TC_EMP_002_pass.png`
});

const result = {
  testCase: 'TC_EMP_002',
  description: 'Sửa nhân viên',
  expected: 'Salary được cập nhật thành 6000',
  actual: currentUrl,
  status: isPassed ? 'PASS' : 'FAIL'
};

results.push(result);

console.log(`✅ Kết quả: ${result.status}`);


} catch (error) {

console.error('❌ Lỗi:', error.message);

results.push({
  testCase: 'TC_EMP_002',
  description: 'Sửa nhân viên',
  status: 'FAIL',
        error: error.message
    });


    }
}


/**
 * Test Case 3: Xóa nhân viên
 */
async function testTC_EMP_003(page) {
console.log('\n========== Test Case 3: Xóa nhân viên ==========');

try {


await page.goto(`${CONFIG.baseURL}/dashboard/employee`, {
  waitUntil: 'networkidle2'
});

// Chờ bảng load
await page.waitForSelector('table tbody tr', {
  timeout: 10000
});

// Đếm số nhân viên trước khi xóa
const beforeCount = await page.$$eval(
  'table tbody tr',
  rows => rows.length
);

console.log('Trước khi xóa:', beforeCount);

if (beforeCount === 0) {
  throw new Error('Không có nhân viên nào để xóa');
}

// Chụp ảnh trước khi xóa
await page.screenshot({
  path: `${CONFIG.screenshotDir}/TC_EMP_003_before_delete.png`
});

// Nếu có confirm dialog
page.once('dialog', async dialog => {
  console.log('Dialog:', dialog.message());
  await dialog.accept();
});

// Click Delete của dòng đầu tiên
await page.click(
  'table tbody tr:first-child button.btn-warning'
);

// Chờ số lượng dòng giảm xuống
await page.waitForFunction(
  count => document.querySelectorAll('table tbody tr').length < count,
  { timeout: 10000 },
  beforeCount
);

// Đếm lại
const afterCount = await page.$$eval(
  'table tbody tr',
  rows => rows.length
);

console.log('Sau khi xóa:', afterCount);

const isPassed = afterCount < beforeCount;

await page.screenshot({
  path: `${CONFIG.screenshotDir}/TC_EMP_003_pass.png`
});

const result = {
  testCase: 'TC_EMP_003',
  description: 'Xóa nhân viên',
  expected: 'Số lượng nhân viên giảm đi 1',
  actual: `Trước: ${beforeCount}, Sau: ${afterCount}`,
  status: isPassed ? 'PASS' : 'FAIL'
};

results.push(result);

console.log(`✅ Kết quả: ${result.status}`);


} catch (error) {


console.error('❌ Lỗi:', error.message);

results.push({
  testCase: 'TC_EMP_003',
  description: 'Xóa nhân viên',
  status: 'FAIL',
  error: error.message
});


}
}


/**
 * Hàm chính
 */
async function main() {
  console.log('🚀 Bắt đầu kiểm thử chức năng quản lý nhân viên...\n');
  
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Đăng nhập
    await login(page);
    
    // Chạy tất cả test cases
    await testTC_EMP_001(page);
    await testTC_EMP_002(page);
    await testTC_EMP_003(page);
    
  } finally {
    await browser.close();
  }
  
  // In kết quả
  console.log('\n\n========== KẾT QUẢ KIỂM THỬ ==========');
  console.log(`Tổng cộng: ${results.length} test cases`);
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    console.log(`\n${result.testCase}: ${result.status}`);
    console.log(`  Mô tả: ${result.description}`);
    console.log(`  Kỳ vọng: ${result.expected}`);
    console.log(`  Thực tế: ${result.actual}`);
    
    if (result.status === 'PASS') passed++;
    else failed++;
  });
  
  console.log(`\n\nPassed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
  console.log(`Pass Rate: ${(passed/results.length*100).toFixed(2)}%`);
  
  // Lưu kết quả vào file
  fs.writeFileSync(
    './results_employee.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✅ Kết quả đã lưu vào results_employee.json');
}

// Chạy chương trình
main().catch(console.error);

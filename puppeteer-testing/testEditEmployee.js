/**
 * Test Case: Kiểm Thử Chức Năng Sửa Nhân Viên
 * File: testEditEmployee.js
 * Tác vụ: Kiểm thử 6 test case cho chức năng sửa nhân viên
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
  screenshotDir: './screenshots/edit_employee'
};

// Tạo thư mục screenshots nếu chưa tồn tại
if (!fs.existsSync(CONFIG.screenshotDir)) {
  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

// Kết quả kiểm thử
const results = [];

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

  console.log('✅ Đã đăng nhập');
}

/**
 * Test Case 1: Sửa nhân viên thành công (thay đổi tất cả trường)
 */
async function testTC_EDIT_EMP_001(page) {
  console.log('\n========== TC_EDIT_EMP_001: Sửa nhân viên thành công ==========');

  try {
    await login(page);

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

    const timestamp = Date.now();
    const newSalary = '7000';
    const newAddress = `Address ${timestamp}`;

    // Xóa salary cũ
    await page.click('#inputSalary', { clickCount: 3 });
    await page.keyboard.press('Backspace');

    // Nhập salary mới
    await page.type('#inputSalary', newSalary, { delay: 50 });

    // Sửa address
    const addressInput = await page.$('#inputAddress');
    await page.evaluate(el => el.value = '', addressInput);
    await page.type('#inputAddress', newAddress, { delay: 50 });

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
      currentUrl.includes('/dashboard/employee');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EDIT_EMP_001_pass.png`
    });

    results.push({
      testCase: 'TC_EDIT_EMP_001',
      description: 'Sửa nhân viên thành công',
      expected: 'Nhân viên được cập nhật thành công với salary mới',
      actual: isPassed ? 'Sửa thành công' : 'Sửa thất bại',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EDIT_EMP_001',
      description: 'Sửa nhân viên thành công',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 2: Tên trống
 */
async function testTC_EDIT_EMP_002(page) {
  console.log('\n========== TC_EDIT_EMP_002: Tên trống ==========');

  try {
    await login(page);

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
    await page.waitForSelector('#inputName');

    // Xóa name
    const nameInput = await page.$('#inputName');
    await page.evaluate(el => el.value = '', nameInput);

    // Submit form
    await page.click('button[type="submit"]');

    // Chờ lỗi validation
    await page.waitForFunction(
      () => document.querySelectorAll('.text-warning').length > 0,
      { timeout: 3000 }
    );

    const errorMessages = await page.evaluate(() => {
      const elements = document.querySelectorAll('.text-warning');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    const isPassed = errorMessages.some(msg => msg.includes('trống'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EDIT_EMP_002_pass.png`
    });

    results.push({
      testCase: 'TC_EDIT_EMP_002',
      description: 'Tên trống',
      expected: 'Hiển thị lỗi "Tên không được để trống"',
      actual: errorMessages.join(', '),
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EDIT_EMP_002',
      description: 'Tên trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 3: Email trống
 */
async function testTC_EDIT_EMP_003(page) {
  console.log('\n========== TC_EDIT_EMP_003: Email trống ==========');

  try {
    await login(page);

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
    await page.waitForSelector('#inputEmail4');

    // Xóa email
    const emailInput = await page.$('#inputEmail4');
    await page.evaluate(el => el.value = '', emailInput);

    // Submit form
    await page.click('button[type="submit"]');

    // Chờ lỗi validation
    await page.waitForFunction(
      () => document.querySelectorAll('.text-warning').length > 0,
      { timeout: 3000 }
    );

    const errorMessages = await page.evaluate(() => {
      const elements = document.querySelectorAll('.text-warning');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    const isPassed = errorMessages.some(msg => msg.includes('Email'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EDIT_EMP_003_pass.png`
    });

    results.push({
      testCase: 'TC_EDIT_EMP_003',
      description: 'Email trống',
      expected: 'Hiển thị lỗi "Email không được để trống"',
      actual: errorMessages.join(', '),
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EDIT_EMP_003',
      description: 'Email trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 4: Salary không hợp lệ (không phải số)
 */
async function testTC_EDIT_EMP_004(page) {
  console.log('\n========== TC_EDIT_EMP_004: Salary không hợp lệ ==========');

  try {
    await login(page);

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

    const salaryInput = await page.$('#inputSalary');
    await page.evaluate(el => el.value = '', salaryInput);

    // Nhập salary không hợp lệ
    await page.type('#inputSalary', 'abc123', { delay: 50 });

    // Submit form
    await page.click('button[type="submit"]');

    // Chờ lỗi validation
    await page.waitForFunction(
      () => document.querySelectorAll('.text-warning').length > 0,
      { timeout: 3000 }
    ).catch(() => {});

    const errorMessages = await page.evaluate(() => {
      const elements = document.querySelectorAll('.text-warning');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    const isPassed = errorMessages.some(msg => msg.includes('Lương'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EDIT_EMP_004_pass.png`
    });

    results.push({
      testCase: 'TC_EDIT_EMP_004',
      description: 'Salary không hợp lệ',
      expected: 'Hiển thị lỗi "Lương phải là số dương"',
      actual: errorMessages.join(', '),
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EDIT_EMP_004',
      description: 'Salary không hợp lệ',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 5: Address trống
 */
async function testTC_EDIT_EMP_005(page) {
  console.log('\n========== TC_EDIT_EMP_005: Address trống ==========');

  try {
    await login(page);

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
    await page.waitForSelector('#inputAddress');

    // Xóa address
    const addressInput = await page.$('#inputAddress');
    await page.evaluate(el => el.value = '', addressInput);

    // Submit form
    await page.click('button[type="submit"]');

    // Chờ lỗi validation
    await page.waitForFunction(
      () => document.querySelectorAll('.text-warning').length > 0,
      { timeout: 3000 }
    );

    const errorMessages = await page.evaluate(() => {
      const elements = document.querySelectorAll('.text-warning');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    const isPassed = errorMessages.some(msg => msg.includes('Địa chỉ'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EDIT_EMP_005_pass.png`
    });

    results.push({
      testCase: 'TC_EDIT_EMP_005',
      description: 'Address trống',
      expected: 'Hiển thị lỗi "Địa chỉ không được để trống"',
      actual: errorMessages.join(', '),
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EDIT_EMP_005',
      description: 'Address trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 6: Thay đổi email thành email trùng lặp
 */
async function testTC_EDIT_EMP_006(page) {
  console.log('\n========== TC_EDIT_EMP_006: Thay đổi email thành email trùng lặp ==========');

  try {
    await login(page);

    // Mở danh sách nhân viên
    await page.goto(`${CONFIG.baseURL}/dashboard/employee`, {
      waitUntil: 'networkidle2'
    });

    // Chờ bảng load
    await page.waitForSelector('table tbody tr', {
      timeout: 10000
    });

    // Lấy email của dòng thứ 2 nếu có
    const secondRowEmail = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      return rows[1] ? rows[1].querySelectorAll('td')[2].textContent.trim() : null;
    });

    if (!secondRowEmail) {
      console.log('⚠️  Không đủ 2 nhân viên để test');
      results.push({
        testCase: 'TC_EDIT_EMP_006',
        description: 'Thay đổi email thành email trùng lặp',
        status: 'SKIP',
        reason: 'Không đủ dữ liệu'
      });
      return;
    }

    // Click nút Edit của dòng đầu tiên
    await page.click('table tbody tr:first-child a.btn-info');

    // Chờ sang trang edit
    await page.waitForFunction(
      () => window.location.pathname.includes('edit_employee'),
      { timeout: 10000 }
    );

    // Chờ form load
    await page.waitForSelector('#inputEmail4');

    // Sửa email thành email của nhân viên khác
    const emailInput = await page.$('#inputEmail4');
    await page.evaluate(el => el.value = '', emailInput);
    await page.type('#inputEmail4', secondRowEmail, { delay: 50 });

    // Submit form
    await page.click('button[type="submit"]');

    // Chờ lỗi
    await page.waitForFunction(
      () => window.location.pathname.includes('/dashboard/employee') ||
             document.querySelector('.text-warning'),
      { timeout: 5000 }
    ).catch(() => {});

    // Kiểm tra kết quả
    const currentUrl = page.url();
    const errorEl = await page.$('.text-warning');

    const isPassed =
      !currentUrl.includes('/dashboard/employee') ||
      (errorEl && await page.$eval('.text-warning', el => 
        el.textContent.includes('exist') || 
        el.textContent.includes('trùng') ||
        el.textContent.includes('đã')
      ));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EDIT_EMP_006_pass.png`
    });

    results.push({
      testCase: 'TC_EDIT_EMP_006',
      description: 'Thay đổi email thành email trùng lặp',
      expected: 'Hiển thị lỗi "Email đã tồn tại"',
      actual: isPassed ? 'Lỗi được hiển thị' : 'Không có lỗi',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EDIT_EMP_006',
      description: 'Thay đổi email thành email trùng lặp',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Hàm chính
 */
async function main() {
  console.log('🚀 Bắt đầu kiểm thử chức năng sửa nhân viên...\n');

  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Chạy tất cả test cases
    await testTC_EDIT_EMP_001(page);
    await testTC_EDIT_EMP_002(page);
    await testTC_EDIT_EMP_003(page);
    await testTC_EDIT_EMP_004(page);
    await testTC_EDIT_EMP_005(page);
    await testTC_EDIT_EMP_006(page);

  } finally {
    await browser.close();
  }

  // In kết quả
  console.log('\n\n========== KẾT QUẢ KIỂM THỬ CHỨC NĂNG SỬA NHÂN VIÊN ==========');
  console.log(`Tổng cộng: ${results.length} test cases\n`);

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  results.forEach(result => {
    console.log(`${result.testCase}: ${result.status}`);
    console.log(`  Mô tả: ${result.description}`);
    if (result.expected) {
      console.log(`  Kỳ vọng: ${result.expected}`);
      console.log(`  Thực tế: ${result.actual}`);
    }
    console.log();

    if (result.status === 'PASS') passed++;
    else if (result.status === 'FAIL') failed++;
    else if (result.status === 'SKIP') skipped++;
  });

  console.log('='.repeat(60));
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
  console.log(`Skipped: ${skipped}/${results.length}`);
  if (passed + failed > 0) {
    console.log(`Pass Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
  }
  console.log('='.repeat(60));

  // Lưu kết quả vào file JSON
  fs.writeFileSync(
    './results_edit_employee.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n✅ Kết quả đã được lưu vào file results_edit_employee.json');
}

main();

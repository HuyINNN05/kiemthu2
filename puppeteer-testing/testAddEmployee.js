/**
 * Test Case: Kiểm Thử Chức Năng Thêm Nhân Viên (với Validation Frontend)
 * File: testAddEmployeeNew.js
 * Tác vụ: Kiểm thử 6 test case cho chức năng thêm nhân viên
 * Dựa trên frontend validation logic
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
  screenshotDir: './screenshots/add_employee_new'
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
    CONFIG.loginEmail,
    { delay: 50 }
  );

  await page.type(
    'input[name="password"]',
    CONFIG.loginPassword,
    { delay: 50 }
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
 * Test Case 1: Thêm nhân viên thành công với tất cả thông tin hợp lệ
 */
async function testTC_ADD_EMP_001(page) {
  console.log('\n========== TC_ADD_EMP_001: Thêm nhân viên thành công ==========');

  try {
    await login(page);

    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();
    const email = `employee${timestamp}@example.com`;
    const name = `Employee ${timestamp}`;

    // Điền tất cả field
    await page.type('#inputName', name, { delay: 50 });
    await page.type('#inputEmail4', email, { delay: 50 });
    await page.type('#inputPassword4', '123456', { delay: 50 });
    await page.type('#inputSalary', '5000', { delay: 50 });
    await page.type('#inputAddress', 'Ha Noi', { delay: 50 });

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

    const currentUrl = page.url();
    const pageContent = await page.content();

    const isPassed =
      currentUrl.includes('/dashboard/employee') &&
      pageContent.includes(email);

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_ADD_EMP_001_pass.png`
    });

    results.push({
      testCase: 'TC_ADD_EMP_001',
      description: 'Thêm nhân viên thành công',
      expected: 'Nhân viên được thêm thành công',
      actual: isPassed ? 'Thêm thành công' : 'Thêm thất bại',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_ADD_EMP_001',
      description: 'Thêm nhân viên thành công',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 2: Tên trống
 */
async function testTC_ADD_EMP_002(page) {
  console.log('\n========== TC_ADD_EMP_002: Tên trống ==========');

  try {
    await login(page);

    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();
    const email = `employee${timestamp}@example.com`;

    // Để tên trống, điền các trường khác
    await page.type('#inputEmail4', email, { delay: 50 });
    await page.type('#inputPassword4', '123456', { delay: 50 });
    await page.type('#inputSalary', '5000', { delay: 50 });
    await page.type('#inputAddress', 'Ha Noi', { delay: 50 });

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

    // Chờ lỗi validation hiện trên UI
    await page.waitForSelector('span.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      'span.text-warning',
      el => el.textContent.trim()
    );

    const isPassed = errorText.includes('trống') && errorText.includes('Name');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_ADD_EMP_002_pass.png`
    });

    results.push({
      testCase: 'TC_ADD_EMP_002',
      description: 'Tên trống',
      expected: 'Hiển thị lỗi "Name không được để trống"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_ADD_EMP_002',
      description: 'Tên trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 3: Email trống
 */
async function testTC_ADD_EMP_003(page) {
  console.log('\n========== TC_ADD_EMP_003: Email trống ==========');

  try {
    await login(page);

    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();

    // Điền form nhưng để email trống
    await page.type('#inputName', `Employee ${timestamp}`, { delay: 50 });
    await page.type('#inputPassword4', '123456', { delay: 50 });
    await page.type('#inputSalary', '5000', { delay: 50 });
    await page.type('#inputAddress', 'Ha Noi', { delay: 50 });

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

    // Chờ lỗi validation
    await page.waitForSelector('span.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      'span.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('Email') && errorText.includes('trống');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_ADD_EMP_003_pass.png`
    });

    results.push({
      testCase: 'TC_ADD_EMP_003',
      description: 'Email trống',
      expected: 'Hiển thị lỗi "Email không được để trống"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_ADD_EMP_003',
      description: 'Email trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 4: Email không hợp lệ (định dạng sai)
 */
async function testTC_ADD_EMP_004(page) {
  console.log('\n========== TC_ADD_EMP_004: Email không hợp lệ ==========');

  try {
    await login(page);

    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();

    // Điền form với email không hợp lệ
    await page.type('#inputName', `Employee ${timestamp}`, { delay: 50 });
    await page.type('#inputEmail4', 'invalidemail', { delay: 50 });
    await page.type('#inputPassword4', '123456', { delay: 50 });
    await page.type('#inputSalary', '5000', { delay: 50 });
    await page.type('#inputAddress', 'Ha Noi', { delay: 50 });

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

    // Chờ lỗi validation
    await page.waitForSelector('span.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      'span.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('Email') &&
      errorText.includes('định dạng');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_ADD_EMP_004_pass.png`
    });

    results.push({
      testCase: 'TC_ADD_EMP_004',
      description: 'Email không hợp lệ',
      expected: 'Hiển thị lỗi "Email không đúng định dạng"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_ADD_EMP_004',
      description: 'Email không hợp lệ',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 5: Salary không phải số
 */
async function testTC_ADD_EMP_005(page) {
  console.log('\n========== TC_ADD_EMP_005: Salary không phải số ==========');

  try {
    await login(page);

    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();
    const email = `employee${timestamp}@example.com`;

    // Điền form với salary không phải số
    await page.type('#inputName', `Employee ${timestamp}`, { delay: 50 });
    await page.type('#inputEmail4', email, { delay: 50 });
    await page.type('#inputPassword4', '123456', { delay: 50 });
    await page.type('#inputSalary', 'abc123xyz', { delay: 50 });
    await page.type('#inputAddress', 'Ha Noi', { delay: 50 });

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

    // Chờ lỗi validation
    await page.waitForSelector('span.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      'span.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('Salary') &&
      (errorText.includes('số') || errorText.includes('dương'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_ADD_EMP_005_pass.png`
    });

    results.push({
      testCase: 'TC_ADD_EMP_005',
      description: 'Salary không phải số',
      expected: 'Hiển thị lỗi "Salary phải là số dương"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_ADD_EMP_005',
      description: 'Salary không phải số',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 6: Image không được chọn
 */
async function testTC_ADD_EMP_006(page) {
  console.log('\n========== TC_ADD_EMP_006: Image không được chọn ==========');

  try {
    await login(page);

    await page.goto(`${CONFIG.baseURL}/dashboard/add_employee`, {
      waitUntil: 'networkidle2'
    });

    const timestamp = Date.now();
    const email = `employee${timestamp}@example.com`;

    // Điền form nhưng không upload ảnh
    await page.type('#inputName', `Employee ${timestamp}`, { delay: 50 });
    await page.type('#inputEmail4', email, { delay: 50 });
    await page.type('#inputPassword4', '123456', { delay: 50 });
    await page.type('#inputSalary', '5000', { delay: 50 });
    await page.type('#inputAddress', 'Ha Noi', { delay: 50 });

    // Chọn category
    try {
      await page.select('#category', '1');
    } catch (e) {
      console.log('Không chọn được category');
    }

    // KHÔNG upload ảnh

    // Submit
    await page.click('button[type="submit"]');

    // Chờ lỗi validation
    await page.waitForSelector('span.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      'span.text-warning',
      el => el.textContent.trim()
    );

    const isPassed = errorText.includes('trống');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_ADD_EMP_006_pass.png`
    });

    results.push({
      testCase: 'TC_ADD_EMP_006',
      description: 'Image không được chọn',
      expected: 'Hiển thị lỗi "Image không được để trống"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_ADD_EMP_006',
      description: 'Image không được chọn',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Hàm chính
 */
async function main() {
  console.log('🚀 Bắt đầu kiểm thử chức năng thêm nhân viên (Frontend Validation)...\n');

  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Chạy tất cả test cases
    await testTC_ADD_EMP_001(page);
    await testTC_ADD_EMP_002(page);
    await testTC_ADD_EMP_003(page);
    await testTC_ADD_EMP_004(page);
    await testTC_ADD_EMP_005(page);
    await testTC_ADD_EMP_006(page);

  } finally {
    await browser.close();
  }

  // In kết quả
  console.log('\n\n========== KẾT QUẢ KIỂM THỬ CHỨC NĂNG THÊM NHÂN VIÊN ==========');
  console.log(`Tổng cộng: ${results.length} test cases\n`);

  let passed = 0;
  let failed = 0;

  results.forEach(result => {
    console.log(`${result.testCase}: ${result.status}`);
    console.log(`  Mô tả: ${result.description}`);
    console.log(`  Kỳ vọng: ${result.expected}`);
    console.log(`  Thực tế: ${result.actual}\n`);

    if (result.status === 'PASS') passed++;
    else failed++;
  });

  console.log('='.repeat(60));
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
  console.log(`Pass Rate: ${(passed / results.length * 100).toFixed(2)}%`);
  console.log('='.repeat(60));

  // Lưu kết quả vào file JSON
  fs.writeFileSync(
    './results_add_employee_new.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n✅ Kết quả đã được lưu vào file results_add_employee_new.json');
}

main();

/**
 * Test Case: Kiểm Thử Chức Năng Đăng Nhập
 * File: testLogin.js
 * Tác vụ: Kiểm thử 6 test case cho chức năng đăng nhập
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

// Cấu hình
const CONFIG = {
  baseURL: 'http://localhost:5173',
  headless: false,
  slowMo: 50,
  screenshotDir: './screenshots/adminlogin'
};

// Tạo thư mục screenshots nếu chưa tồn tại
if (!fs.existsSync(CONFIG.screenshotDir)) {
  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

// Kết quả kiểm thử
const results = [];

/**
 * Test Case 1: Đăng nhập thành công với thông tin hợp lệ
 */
async function testTC_LI_001(page) {
  console.log('\n========== Test Case 1: Đăng nhập thành công ==========');
  
  try {
    await page.goto(`${CONFIG.baseURL}/adminlogin`, {
      waitUntil: 'networkidle2'
    });
    
    // Nhập email
    await page.type('input[name="email"]', 'admin@example.com', { delay: 100 });
    
    // Nhập mật khẩu
    await page.type('input[name="password"]', 'admin123', { delay: 100 });
    
    // Nhấn nút Login
    await page.click('button.btn.btn-success');

    
    // Chờ chuyển trang
    await page.waitForFunction(
        () => window.location.pathname.includes('dashboard'),
        { timeout: 10000 }
    );
    
    const url = page.url();
    const isPassed = url.includes('dashboard');
    
    // Chụp ảnh
    await page.screenshot({ 
      path: `${CONFIG.screenshotDir}/TC_LI_001_pass.png`
    });
    
    const result = {
      testCase: 'TC_LI_001',
      description: 'Đăng nhập thành công',
      expected: 'Chuyển sang Dashboard',
      actual: isPassed ? 'Chuyển sang Dashboard' : 'Lỗi: Không chuyển trang',
      status: isPassed ? 'PASS' : 'FAIL'
    };
    
    results.push(result);
    console.log(`✅ Kết quả: ${result.status}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    results.push({
      testCase: 'TC_LI_001',
      description: 'Đăng nhập thành công',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 2: Email trống
 */
async function testTC_LI_002(page) {
  console.log('\n========== Test Case 2: Email trống ==========');
  
  try {
    await page.goto(`${CONFIG.baseURL}/adminlogin`, {
      waitUntil: 'networkidle2'
    });
    
    // Để email trống
    // Nhập mật khẩu
    await page.type('input[name="password"]', 'Admin@123', { delay: 100 });
    
    // Nhấn nút Login
    await page.click('button.btn.btn-success');

    
    // Chờ lỗi validation
    await page.waitForSelector('.text-warning');

    const errorText = await page.$eval(
       '.text-warning',
       el => el.textContent.trim()
    );
    
    const isPassed = errorText.includes('trống') || errorText.includes('required');
    
    // Chụp ảnh
    await page.screenshot({ 
      path: `${CONFIG.screenshotDir}/TC_LI_002_pass.png`
    });
    
    const result = {
      testCase: 'TC_LI_002',
      description: 'Email trống',
      expected: 'Hiển thị lỗi "Email không được để trống"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    };
    
    results.push(result);
    console.log(`✅ Kết quả: ${result.status}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    results.push({
      testCase: 'TC_LI_002',
      description: 'Email trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 3: Mật khẩu trống
 */
async function testTC_LI_003(page) {
  console.log('\n========== Test Case 3: Mật khẩu trống ==========');
  
  try {
    await page.goto(`${CONFIG.baseURL}/adminlogin`, {
      waitUntil: 'networkidle2'
    });
    
    // Nhập email
    await page.type('input[name="email"]', 'admin@example.com', { delay: 100 });
    
    // Để mật khẩu trống
    
    // Nhấn nút Login
    await page.click('button.btn.btn-success');

    
    // Chờ lỗi validation
     await page.waitForSelector('.text-warning');

    const errorText = await page.$eval(
       '.text-warning',
       el => el.textContent.trim()
    );
    const isPassed = errorText.includes('trống') || errorText.includes('required');
    
    // Chụp ảnh
    await page.screenshot({ 
      path: `${CONFIG.screenshotDir}/TC_LI_003_pass.png`
    });
    
    const result = {
      testCase: 'TC_LI_003',
      description: 'Mật khẩu trống',
      expected: 'Hiển thị lỗi "Mật khẩu không được để trống"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    };
    
    results.push(result);
    console.log(`✅ Kết quả: ${result.status}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    results.push({
      testCase: 'TC_LI_003',
      description: 'Mật khẩu trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 4: Mật khẩu sai
 */
async function testTC_LI_004(page) {
  console.log('\n========== Test Case 4: Mật khẩu sai ==========');
  
  try {
    await page.goto(`${CONFIG.baseURL}/adminlogin`, {
      waitUntil: 'networkidle2'
    });
    
    // Nhập email
    await page.type('input[name="email"]', 'admin@example.com', { delay: 100 });
    
    // Nhập mật khẩu sai
    await page.type('input[name="password"]', 'WrongPassword', { delay: 100 });
    
    // Nhấn nút Login
    await page.click('button.btn.btn-success');

    
    // Chờ lỗi
    await page.waitForSelector('.text-warning', { timeout: 3000 });
    const errorText = await page.$eval('.text-warning', el => el.textContent);
    
    const isPassed = errorText.includes('wrong') || errorText.includes('invalid');
    
    // Chụp ảnh
    await page.screenshot({ 
      path: `${CONFIG.screenshotDir}/TC_LI_004_pass.png`
    });
    
    const result = {
      testCase: 'TC_LI_004',
      description: 'Mật khẩu sai',
      expected: 'Hiển thị lỗi "Email hoặc mật khẩu sai"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    };
    
    results.push(result);
    console.log(`✅ Kết quả: ${result.status}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    results.push({
      testCase: 'TC_LI_004',
      description: 'Mật khẩu sai',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 5: Email không tồn tại
 */
async function testTC_LI_005(page) {
  console.log('\n========== Test Case 5: Email không tồn tại ==========');
  
  try {
    await page.goto(`${CONFIG.baseURL}/adminlogin`, {
      waitUntil: 'networkidle2'
    });
    
    // Nhập email không tồn tại
    await page.type('input[name="email"]', 'notexist@test.com', { delay: 100 });
    
    // Nhập mật khẩu
    await page.type('input[name="password"]', 'Password123', { delay: 100 });
    
    // Nhấn nút Login
    await page.click('button.btn.btn-success');

    
    // Chờ lỗi
    await page.waitForSelector('.text-warning', { timeout: 3000 });
    const errorText = await page.$eval('.text-warning', el => el.textContent);
    
    const isPassed = errorText.includes('wrong') || errorText.includes('không');
    
    // Chụp ảnh
    await page.screenshot({ 
      path: `${CONFIG.screenshotDir}/TC_LI_005_pass.png`
    });
    
    const result = {
      testCase: 'TC_LI_005',
      description: 'Email không tồn tại',
      expected: 'Hiển thị lỗi',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    };
    
    results.push(result);
    console.log(`✅ Kết quả: ${result.status}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    results.push({
      testCase: 'TC_LI_005',
      description: 'Email không tồn tại',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 6: Email không hợp lệ
 */
async function testTC_LI_006(page) {
  console.log('\n========== Test Case 6: Email không hợp lệ ==========');
  
  try {
    await page.goto(`${CONFIG.baseURL}/adminlogin`, {
      waitUntil: 'networkidle2'
    });
    
    // Nhập email không hợp lệ
    await page.type('input[name="email"]', 'invalidemail', { delay: 100 });
    
    // Nhập mật khẩu
    await page.type('input[name="password"]', 'Password123', { delay: 100 });
    
    // Nhấn nút Login
    await page.click('button.btn.btn-success');

    
    // Chờ lỗi
    await page.waitForSelector('.text-warning', { timeout: 3000 });
    const errorText = await page.$eval('.text-warning', el => el.textContent);
    
const isPassed =
    errorText.includes('Email') ||
    errorText.includes('trống');
    
    // Chụp ảnh
    await page.screenshot({ 
      path: `${CONFIG.screenshotDir}/TC_LI_006_pass.png`
    });
    
    const result = {
      testCase: 'TC_LI_006',
      description: 'Email không hợp lệ',
      expected: 'Hiển thị lỗi "Email không đúng định dạng"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    };
    
    results.push(result);
    console.log(`✅ Kết quả: ${result.status}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    results.push({
      testCase: 'TC_LI_006',
      description: 'Email không hợp lệ',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Hàm chính
 */
async function main() {
  console.log('🚀 Bắt đầu kiểm thử chức năng đăng nhập...\n');
  
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Chạy tất cả test cases
    await testTC_LI_001(page);
    await testTC_LI_002(page);
    await testTC_LI_003(page);
    await testTC_LI_004(page);
    await testTC_LI_005(page);
    await testTC_LI_006(page);
    
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
    './results_login.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✅ Kết quả đã lưu vào results_login.json');
}

// Chạy chương trình
main().catch(console.error);
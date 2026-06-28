const puppeteer = require('puppeteer');

const CONFIG = {
  baseURL: 'http://localhost:5173',
  loginEmail: 'a@gmail.com', // sửa lại nếu cần
  loginPassword: '123',   // sửa lại nếu cần
  headless: false,
  slowMo: 100,
  screenshotDir: './screenshots'
};

const results = [];

/**
 * TC_EMP_LOGIN_001
 * Đăng nhập thành công
 */
async function testTC_EMP_LOGIN_001(page) {
  console.log('\n========== TC_EMP_LOGIN_001: Đăng nhập thành công ==========');

  try {

    await page.goto(`${CONFIG.baseURL}/employee_login`, {
      waitUntil: 'networkidle2'
    });

    await page.type(
      'input[name="email"]',
      CONFIG.loginEmail,
      { delay: 100 }
    );

    await page.type(
      'input[name="password"]',
      CONFIG.loginPassword,
      { delay: 100 }
    );

    await page.click('button.btn.btn-success');

    await page.waitForFunction(
      () => window.location.pathname.includes('employee_detail'),
      { timeout: 10000 }
    );

    const currentUrl = page.url();

    const isPassed =
      currentUrl.includes('employee_detail');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_LOGIN_001.png`
    });

    results.push({
      testCase: 'TC_EMP_LOGIN_001',
      description: 'Đăng nhập thành công',
      expected: 'Chuyển sang employee_detail',
      actual: currentUrl,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {

    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_LOGIN_001',
      description: 'Đăng nhập thành công',
      status: 'FAIL',
      error: error.message
    });

  }
}

/**
 * TC_EMP_LOGIN_002
 * Email trống
 */
async function testTC_EMP_LOGIN_002(page) {
  console.log('\n========== TC_EMP_LOGIN_002: Email trống ==========');

  try {

    await page.goto(`${CONFIG.baseURL}/employee_login`, {
      waitUntil: 'networkidle2'
    });

    await page.type(
      'input[name="password"]',
      '123',
      { delay: 100 }
    );

    await page.click('button.btn.btn-success');

    await page.waitForSelector('.text-warning');

    const errorText = await page.$eval(
      '.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('trống');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_LOGIN_002.png`
    });

    results.push({
      testCase: 'TC_EMP_LOGIN_002',
      description: 'Email trống',
      expected: 'Email không được để trống',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {

    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_LOGIN_002',
      description: 'Email trống',
      status: 'FAIL',
      error: error.message
    });

  }
}

/**
 * TC_EMP_LOGIN_003
 * Mật khẩu trống
 */
async function testTC_EMP_LOGIN_003(page) {
  console.log('\n========== TC_EMP_LOGIN_003: Mật khẩu trống ==========');

  try {

    await page.goto(`${CONFIG.baseURL}/employee_login`, {
      waitUntil: 'networkidle2'
    });

    await page.type(
      'input[name="email"]',
      CONFIG.loginEmail,
      { delay: 100 }
    );

    await page.click('button.btn.btn-success');

    await page.waitForSelector('.text-warning');

    const errorText = await page.$eval(
      '.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('trống');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_LOGIN_003.png`
    });

    results.push({
      testCase: 'TC_EMP_LOGIN_003',
      description: 'Mật khẩu trống',
      expected: 'Mật khẩu không được để trống',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {

    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_LOGIN_003',
      description: 'Mật khẩu trống',
      status: 'FAIL',
      error: error.message
    });

  }
}

/**
 * TC_EMP_LOGIN_004
 * Mật khẩu sai
 */
async function testTC_EMP_LOGIN_004(page) {
  console.log('\n========== TC_EMP_LOGIN_004: Mật khẩu sai ==========');

  try {

    await page.goto(`${CONFIG.baseURL}/employee_login`, {
      waitUntil: 'networkidle2'
    });

    await page.type(
      'input[name="email"]',
      CONFIG.loginEmail,
      { delay: 100 }
    );

    await page.type(
      'input[name="password"]',
      'wrongpassword123',
      { delay: 100 }
    );

    await page.click('button.btn.btn-success');

    await page.waitForSelector('.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      '.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('wrong') ||
      errorText.includes('sai') ||
      errorText.includes('không');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_LOGIN_004.png`
    });

    results.push({
      testCase: 'TC_EMP_LOGIN_004',
      description: 'Mật khẩu sai',
      expected: 'Hiển thị lỗi "Mật khẩu sai" hoặc "Thông tin không chính xác"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {

    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_LOGIN_004',
      description: 'Mật khẩu sai',
      status: 'FAIL',
      error: error.message
    });

  }
}

/**
 * TC_EMP_LOGIN_005
 * Email không tồn tại
 */
async function testTC_EMP_LOGIN_005(page) {
  console.log('\n========== TC_EMP_LOGIN_005: Email không tồn tại ==========');

  try {

    await page.goto(`${CONFIG.baseURL}/employee_login`, {
      waitUntil: 'networkidle2'
    });

    await page.type(
      'input[name="email"]',
      'notexist@test.com',
      { delay: 100 }
    );

    await page.type(
      'input[name="password"]',
      'password123',
      { delay: 100 }
    );

    await page.click('button.btn.btn-success');

    await page.waitForSelector('.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      '.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('wrong') ||
      errorText.includes('không') ||
      errorText.includes('sai');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_LOGIN_005.png`
    });

    results.push({
      testCase: 'TC_EMP_LOGIN_005',
      description: 'Email không tồn tại',
      expected: 'Hiển thị lỗi "Email không tồn tại"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {

    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_LOGIN_005',
      description: 'Email không tồn tại',
      status: 'FAIL',
      error: error.message
    });

  }
}

/**
 * TC_EMP_LOGIN_006
 * Email không hợp lệ
 */
async function testTC_EMP_LOGIN_006(page) {
  console.log('\n========== TC_EMP_LOGIN_006: Email không hợp lệ ==========');

  try {

    await page.goto(`${CONFIG.baseURL}/employee_login`, {
      waitUntil: 'networkidle2'
    });

    await page.type(
      'input[name="email"]',
      'invalidemail',
      { delay: 100 }
    );

    await page.type(
      'input[name="password"]',
      'password123',
      { delay: 100 }
    );

    await page.click('button.btn.btn-success');

    await page.waitForSelector('.text-warning', { timeout: 3000 });

    const errorText = await page.$eval(
      '.text-warning',
      el => el.textContent.trim()
    );

    const isPassed =
      errorText.includes('Email') ||
      errorText.includes('trống') ||
      errorText.includes('hợp lệ');

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_EMP_LOGIN_006.png`
    });

    results.push({
      testCase: 'TC_EMP_LOGIN_006',
      description: 'Email không hợp lệ',
      expected: 'Hiển thị lỗi "Email không đúng định dạng"',
      actual: errorText,
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {

    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_EMP_LOGIN_006',
      description: 'Email không hợp lệ',
      status: 'FAIL',
      error: error.message
    });

  }
}

async function main() {

  console.log('🚀 Bắt đầu kiểm thử Employee Login...\n');

  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });

  try {

    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 720
    });

    await testTC_EMP_LOGIN_001(page);
    await testTC_EMP_LOGIN_002(page);
    await testTC_EMP_LOGIN_003(page);
    await testTC_EMP_LOGIN_004(page);
    await testTC_EMP_LOGIN_005(page);
    await testTC_EMP_LOGIN_006(page);

  } finally {

    await browser.close();

  }

  console.log('\n========== KẾT QUẢ KIỂM THỬ ==========');

  let passed = 0;
  let failed = 0;

  results.forEach(result => {

    console.log(`\n${result.testCase}: ${result.status}`);
    console.log(`  Mô tả: ${result.description}`);
    console.log(`  Kỳ vọng: ${result.expected}`);
    console.log(`  Thực tế: ${result.actual}`);

    if (result.status === 'PASS') {
      passed++;
    } else {
      failed++;
    }

  });

  console.log(`\nPassed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
  console.log(
    `Pass Rate: ${(passed / results.length * 100).toFixed(2)}%`
  );

}

main();
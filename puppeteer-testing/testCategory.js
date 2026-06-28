/**
 * Test Case: Kiểm Thử Chức Năng Category (Thêm, Sửa, Xoá)
 * File: testCategory.js
 * Tác vụ: Kiểm thử chức năng thêm, sửa, xoá danh mục
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
  screenshotDir: './screenshots/category'
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
 * Test Case 1: Thêm danh mục thành công
 */
async function testTC_CATE_ADD_001(page) {
  console.log('\n========== TC_CATE_ADD_001: Thêm danh mục thành công ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
      waitUntil: 'networkidle2'
    });

    // Click nút "Add Category"
    await page.click('a.btn.btn-success');

    // Chờ sang trang thêm
    await page.waitForFunction(
      () => window.location.pathname.includes('add_category'),
      { timeout: 10000 }
    );

    // Chờ form load
    await page.waitForSelector('input[name="category"]');

    const timestamp = Date.now();
    const categoryName = `Category ${timestamp}`;

    // Nhập tên danh mục
    await page.type('input[name="category"]', categoryName, { delay: 50 });

    // Submit form
    await page.click('button.btn.btn-success');

    // Chờ quay về trang danh sách
    await page.waitForFunction(
      () => window.location.pathname.includes('/dashboard/category'),
      { timeout: 10000 }
    );

    // Kiểm tra danh mục mới xuất hiện trong bảng
    const pageContent = await page.content();
    const isPassed = pageContent.includes(categoryName);

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_ADD_001_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_ADD_001',
      description: 'Thêm danh mục thành công',
      expected: 'Danh mục mới xuất hiện trong danh sách',
      actual: isPassed ? 'Danh mục được thêm thành công' : 'Danh mục không được thêm',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_ADD_001',
      description: 'Thêm danh mục thành công',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 2: Thêm danh mục trống
 */
async function testTC_CATE_ADD_002(page) {
  console.log('\n========== TC_CATE_ADD_002: Thêm danh mục trống ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
      waitUntil: 'networkidle2'
    });

    // Click nút "Add Category"
    await page.click('a.btn.btn-success');

    // Chờ sang trang thêm
    await page.waitForFunction(
      () => window.location.pathname.includes('category'),
      { timeout: 10000 }
    );

    // Chờ form load
    await page.waitForSelector('input[name="category"]');

    // Submit form mà không nhập gì
    await page.click('button.btn.btn-success');

    // Chờ lỗi validation
    await page.waitForFunction(
      () => document.querySelectorAll('.text-warning').length > 0,
      { timeout: 3000 }
    );

    const errorMessages = await page.evaluate(() => {
      const elements = document.querySelectorAll('.text-warning');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    const isPassed = errorMessages.some(msg => msg.includes('Danh mục'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_ADD_002_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_ADD_002',
      description: 'Thêm danh mục trống',
      expected: 'Hiển thị lỗi "Danh mục không được để trống"',
      actual: errorMessages.join(', '),
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_ADD_002',
      description: 'Thêm danh mục trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 3: Sửa danh mục thành công
 */
async function testTC_CATE_EDIT_001(page) {
  console.log('\n========== TC_CATE_EDIT_001: Sửa danh mục thành công ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
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
      () => window.location.pathname.includes('edit_category'),
      { timeout: 10000 }
    );

    // Chờ form load
    await page.waitForSelector('input[name="category"]');

    const timestamp = Date.now();
    const newCategoryName = `Edited Category ${timestamp}`;

    // Xóa tên cũ và nhập tên mới
    const categoryInput = await page.$('input[name="category"]');
    await page.evaluate(el => el.value = '', categoryInput);
    await page.type('input[name="category"]', newCategoryName, { delay: 50 });

    // Submit form
    await page.click('button.btn.btn-success');

    // Chờ quay về trang danh sách
    await page.waitForFunction(
      () => window.location.pathname.includes('/dashboard/category'),
      { timeout: 10000 }
    );

    // Kiểm tra danh mục được sửa
    const pageContent = await page.content();
    const isPassed = pageContent.includes(newCategoryName);

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_EDIT_001_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_EDIT_001',
      description: 'Sửa danh mục thành công',
      expected: 'Danh mục được sửa thành công với tên mới',
      actual: isPassed ? 'Danh mục được sửa thành công' : 'Sửa danh mục thất bại',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_EDIT_001',
      description: 'Sửa danh mục thành công',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 4: Sửa danh mục thành trống
 */
async function testTC_CATE_EDIT_002(page) {
  console.log('\n========== TC_CATE_EDIT_002: Sửa danh mục thành trống ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
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
      () => window.location.pathname.includes('edit_category'),
      { timeout: 10000 }
    );

    // Chờ form load
    await page.waitForSelector('input[name="category"]');

    // Xóa tên danh mục
    const categoryInput = await page.$('input[name="category"]');
    await page.evaluate(el => el.value = '', categoryInput);

    // Submit form
    await page.click('button.btn.btn-success');

    // Chờ lỗi validation
    await page.waitForFunction(
      () => document.querySelectorAll('.text-warning').length > 0,
      { timeout: 3000 }
    );

    const errorMessages = await page.evaluate(() => {
      const elements = document.querySelectorAll('.text-warning');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    const isPassed = errorMessages.some(msg => msg.includes('Danh mục'));

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_EDIT_002_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_EDIT_002',
      description: 'Sửa danh mục thành trống',
      expected: 'Hiển thị lỗi "Danh mục không được để trống"',
      actual: errorMessages.join(', '),
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_EDIT_002',
      description: 'Sửa danh mục thành trống',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 5: Xoá danh mục - Item bất kỳ
 */
async function testTC_CATE_DELETE_01(page) {
  console.log('\n========== TC_CATE_DELETE_01: Click nút xoá của một item bất kỳ ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
      waitUntil: 'networkidle2'
    });

    // Chờ bảng load
    await page.waitForSelector('table tbody tr', {
      timeout: 10000
    });

    // Lấy tên danh mục của dòng đầu tiên
    const deletedCategoryName = await page.evaluate(() => {
      const firstRow = document.querySelector('table tbody tr:first-child');
      return firstRow.querySelectorAll('td')[0].textContent.trim();
    });

    // Click nút delete của dòng đầu tiên
    await page.click('table tbody tr:first-child button.btn-danger');

    // Handle dialog confirm
    await page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Chờ danh sách load lại
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Kiểm tra danh mục bị xoá đã biến mất
    const pageContent = await page.content();
    const isPassed = !pageContent.includes(deletedCategoryName);

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_DELETE_01_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_DELETE_01',
      description: 'Click nút xoá của một item bất kỳ',
      expected: 'Đúng item được chọn bị xoá khỏi danh sách',
      actual: isPassed ? `Danh mục "${deletedCategoryName}" được xoá` : 'Xoá thất bại',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_DELETE_01',
      description: 'Click nút xoá của một item bất kỳ',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 6: Xoá danh mục - Item đầu tiên
 */
async function testTC_CATE_DELETE_03(page) {
  console.log('\n========== TC_CATE_DELETE_03: Click nút xoá của item đầu tiên ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
      waitUntil: 'networkidle2'
    });

    // Chờ bảng load
    await page.waitForSelector('table tbody tr', {
      timeout: 10000
    });

    // Lấy danh sách các danh mục trước xoá
    const categoriesBeforeDelete = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      return Array.from(rows).map(row => row.querySelectorAll('td')[0].textContent.trim());
    });

    const firstCategoryToDelete = categoriesBeforeDelete[0];

    // Setup dialog handler
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Click nút delete của dòng đầu tiên
    await page.click('table tbody tr:first-child button.btn-danger');

    // Chờ danh sách load lại
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reload lại trang
    await page.reload({ waitUntil: 'networkidle2' });

    // Kiểm tra các item còn lại
    const categoriesAfterDelete = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      return Array.from(rows).map(row => row.querySelectorAll('td')[0].textContent.trim());
    });

    // Item đầu tiên phải bị xoá, các item khác không bị ảnh hưởng
    const isPassed = !categoriesAfterDelete.includes(firstCategoryToDelete) && 
                     categoriesAfterDelete.length === categoriesBeforeDelete.length - 1;

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_DELETE_03_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_DELETE_03',
      description: 'Click nút xoá của item đầu tiên',
      expected: 'Item đầu tiên bị xoá đúng, các item còn lại không bị ảnh hưởng',
      actual: isPassed ? 'Item được xoá chính xác, các item khác vẫn nguyên' : 'Xoá không chính xác',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_DELETE_03',
      description: 'Click nút xoá của item đầu tiên',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Test Case 7: Xoá danh mục - Item cuối cùng
 */
async function testTC_CATE_DELETE_05(page) {
  console.log('\n========== TC_CATE_DELETE_05: Click nút xoá của item cuối danh sách ==========');

  try {
    await login(page);

    // Mở danh sách category
    await page.goto(`${CONFIG.baseURL}/dashboard/category`, {
      waitUntil: 'networkidle2'
    });

    // Chờ bảng load
    await page.waitForSelector('table tbody tr', {
      timeout: 10000
    });

    // Lấy danh sách các danh mục trước xoá
    const categoriesBeforeDelete = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      return Array.from(rows).map(row => row.querySelectorAll('td')[0].textContent.trim());
    });

    const lastCategoryToDelete = categoriesBeforeDelete[categoriesBeforeDelete.length - 1];

    // Setup dialog handler
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Click nút delete của dòng cuối cùng
    await page.click('table tbody tr:last-child button.btn-danger');

    // Chờ danh sách load lại
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reload lại trang
    await page.reload({ waitUntil: 'networkidle2' });

    // Kiểm tra các item còn lại
    const categoriesAfterDelete = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      return Array.from(rows).map(row => row.querySelectorAll('td')[0].textContent.trim());
    });

    // Item cuối cùng phải bị xoá, các item khác không bị ảnh hưởng
    const isPassed = !categoriesAfterDelete.includes(lastCategoryToDelete) && 
                     categoriesAfterDelete.length === categoriesBeforeDelete.length - 1;

    await page.screenshot({
      path: `${CONFIG.screenshotDir}/TC_CATE_DELETE_05_pass.png`
    });

    results.push({
      testCase: 'TC_CATE_DELETE_05',
      description: 'Click nút xoá của item cuối danh sách',
      expected: 'Item cuối danh sách bị xoá đúng, các item còn lại không bị ảnh hưởng',
      actual: isPassed ? 'Item được xoá chính xác, các item khác vẫn nguyên' : 'Xoá không chính xác',
      status: isPassed ? 'PASS' : 'FAIL'
    });

    console.log(`✅ Kết quả: ${isPassed ? 'PASS' : 'FAIL'}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);

    results.push({
      testCase: 'TC_CATE_DELETE_05',
      description: 'Click nút xoá của item cuối danh sách',
      status: 'FAIL',
      error: error.message
    });
  }
}

/**
 * Hàm chính
 */
async function main() {
  console.log('🚀 Bắt đầu kiểm thử chức năng Category (Thêm, Sửa, Xoá)...\n');

  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Chạy tất cả test cases
    await testTC_CATE_ADD_001(page);
    await testTC_CATE_ADD_002(page);
    await testTC_CATE_EDIT_001(page);
    await testTC_CATE_EDIT_002(page);
    await testTC_CATE_DELETE_01(page);
    await testTC_CATE_DELETE_03(page);
    await testTC_CATE_DELETE_05(page);

  } finally {
    await browser.close();
  }

  // In kết quả
  console.log('\n\n========== KẾT QUẢ KIỂM THỬ CHỨC NĂNG CATEGORY ==========');
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
    './results_category.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n✅ Kết quả đã được lưu vào file results_category.json');
}

main();

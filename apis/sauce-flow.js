import { browser } from 'k6/browser';
import { check } from 'k6';

export async function testSauceDemoBrowserFlow() {
    // Khởi tạo trang mới với await
    const page = await browser.newPage();

    try {
        // 1. Truy cập trang chủ Saucedemo
        await page.goto('https://www.saucedemo.com/');

        // 2. Nhập thông tin đăng nhập
        await page.locator('#user-name').type('standard_user');
        await page.locator('#password').type('secret_sauce');

        // 3. Click nút login và chờ chuyển hướng
        await Promise.all([
            page.waitForNavigation(),
            page.locator('#login-button').click(),
        ]);

        // 4. Kiểm tra URL đã vào trang inventory thành công chưa
        check(page, {
            'Is inventory page displayed': (p) => p.url().includes('/inventory.html'),
        });

    } finally {
        // Đóng trang an toàn bằng await để giải phóng tài nguyên
        await page.close();
    }
}
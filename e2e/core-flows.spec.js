import { expect, test } from '@playwright/test';

const customer = {
  id: 1,
  username: 'customer1',
  first_name: 'An',
  last_name: 'Nguyễn',
  email: 'an@example.com',
  is_staff: false,
  is_superuser: false,
};

const parkingLots = [
  { id: 1, name: 'Green Central Car Park', address: 'Quận 1', price_per_hour: 25000 },
];
const parkingSpots = [
  { id: 101, parkinglot: 1, status: 'available' },
  { id: 102, parkinglot: 1, status: 'occupied' },
];

async function useVietnamese(page) {
  await page.addInitScript(() => localStorage.setItem('gcp:language:v1', 'vi'));
}

async function mockParkingApi(page) {
  await page.route(/(pythonanywhere\.com|\/api)\/parkinglot\/?(\?.*)?$/, (route) => route.fulfill({ json: parkingLots }));
  await page.route(/(pythonanywhere\.com|\/api)\/parkingspot\/?(\?.*)?$/, (route) => route.fulfill({ json: parkingSpots }));
}

async function authenticateCustomer(page) {
  await page.addInitScript((user) => {
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; SameSite=Strict`;
    document.cookie = `token=${encodeURIComponent(JSON.stringify({ access_token: 'e2e-token' }))}; path=/; SameSite=Strict`;
  }, customer);
}

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await useVietnamese(page);
});

test('đăng nhập bằng mật khẩu và khôi phục đúng trang yêu cầu', async ({ page }) => {
  await page.route(/(pythonanywhere\.com|\/api)\/o\/token\/?(\?.*)?$/, (route) => route.fulfill({
    json: { access_token: 'access-token', refresh_token: 'refresh-token', token_type: 'Bearer' },
  }));
  await page.route(/(pythonanywhere\.com|\/api)\/user\/current-user\/?(\?.*)?$/, (route) => route.fulfill({ json: customer }));
  await page.route(/(pythonanywhere\.com|\/api)\/vehicle\/?(\?.*)?$/, (route) => route.fulfill({ json: [] }));
  await page.route(/(pythonanywhere\.com|\/api)\/booking\/?(\?.*)?$/, (route) => route.fulfill({ json: [] }));

  await page.goto('/booking/101');
  await expect(page).toHaveURL(/\/login$/);
  await page.locator('#login-username').fill('customer1');
  await page.locator('#login-password').fill('Customer@123');
  await page.getByRole('button', { name: 'Đăng nhập an toàn' }).click();

  await expect(page).toHaveURL(/\/booking\/101$/);
  await expect(page.getByRole('heading', { name: 'Chỗ đỗ #101' })).toBeVisible();
});

test('chọn bãi và mở lựa chọn dịch vụ cho vị trí trống', async ({ page }) => {
  await mockParkingApi(page);
  await page.goto('/parking');

  await page.getByRole('button', { name: /Green Central Car Park/ }).click();
  await page.getByRole('button', { name: /Vị trí 101/ }).click();

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chỗ đỗ #101' })).toBeVisible();
});

test('hoàn tất biểu mẫu đặt chỗ với dữ liệu API đã chuẩn hóa', async ({ page }) => {
  await authenticateCustomer(page);
  await page.route(/(pythonanywhere\.com|\/api)\/vehicle\/?(\?.*)?$/, (route) => route.fulfill({
    json: [{ id: 1, license_plate: '51F-123.45', brand: 'Toyota', car_model: 'Camry', color: 'Trắng' }],
  }));
  await page.route(/(pythonanywhere\.com|\/api)\/booking\/?(\?.*)?$/, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ json: { id: 10, short_link: null } });
      return;
    }
    await route.fulfill({ json: [] });
  });

  await page.goto('/booking/101');
  await page.locator('#booking-vehicle').selectOption('1');
  await page.locator('#booking-start').fill('2026-09-10T08:00');
  await page.locator('#booking-end').fill('2026-09-10T10:00');
  await page.getByRole('button', { name: 'Xác nhận đặt chỗ' }).click();

  await expect(page.getByRole('status')).toContainText('Đã xác nhận đặt chỗ #101');
});

test('điều hướng thích ứng đúng theo viewport', async ({ page }) => {
  await page.goto('/');
  const width = page.viewportSize()?.width || 0;
  const mobileMenuButton = page.getByRole('button', { name: 'Mở menu' });
  const desktopNavigation = page.getByRole('navigation', { name: 'Điều hướng chính' });

  if (width < 1280) {
    await expect(mobileMenuButton).toBeVisible();
    await mobileMenuButton.click();
    await expect(page.getByRole('navigation', { name: 'Điều hướng mobile và tablet' })).toBeVisible();
  } else {
    await expect(mobileMenuButton).toBeHidden();
    await expect(desktopNavigation).toBeVisible();
  }
});

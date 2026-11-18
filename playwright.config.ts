import { defineConfig, devices } from '@playwright/test';
import { STUDENT_ID } from './helpers/env';

// Thời điểm bắt đầu lần chạy (ISO 8601), in lên tiêu đề và metadata của báo cáo HTML
const RUN_AT = new Date().toISOString();
// Thư mục báo cáo của lần chạy này, ví dụ reports/FR02-chromium (đặt bởi scripts/run-reports.ps1)
const REPORT_DIR = process.env.REPORT_DIR ?? 'playwright-report';

export default defineConfig({
  testDir: './tests',
  // Các test dùng chung một backend EShop (mỗi test reset DB) → chạy lần lượt, 1 worker
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: REPORT_DIR, open: 'never', title: `EShop HW04 — Run by: ${STUDENT_ID} — ${RUN_AT}` }],
    ['json', { outputFile: `${REPORT_DIR}/results.json` }],
  ],
  // Hiển thị trong phần metadata của báo cáo HTML
  metadata: {
    'Run by': STUDENT_ID,
    'Run at (ISO)': RUN_AT,
    SUT: 'EShop (ttbhanh/eshop-sut) — Web :5173, Admin :5174, API :3000',
  },

  use: {
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

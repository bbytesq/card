import { defineConfig } from '@playwright/test';

const frontendPort = 8080;
const appUrl = `http://localhost:${frontendPort}`;

export default defineConfig({
  reporter: 'list',
  workers: 1,
  timeout: 4000,
  testDir: './tests',
  outputDir: './test-results',
  expect: {
    toHaveScreenshot: { maxDiffPixels: 10 },
  },
  use: {
    browserName: 'chromium',
    baseURL: appUrl,
  },
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: true,
    url: appUrl,
  },
});

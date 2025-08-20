import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  retries: 2,
  projects: [
    {
      name: 'Customer Success Tests',
      use: { 
        baseURL: 'http://localhost:3000',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Mobile Tests',
      use: { 
        ...devices['iPhone 13'],
        baseURL: 'http://localhost:3000',
      },
    },
  ],
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});

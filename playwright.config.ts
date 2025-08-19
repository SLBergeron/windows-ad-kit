import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  projects: [
    {
      name: 'Customer Success Tests',
      use: { 
        baseURL: 'https://windowsadkit.com',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  reporter: [
    ['html', { outputFolder: 'test-results/customer-success' }],
  ],
});

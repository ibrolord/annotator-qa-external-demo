import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.EXTERNAL_DEMO_PORT ?? 4273);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm build && pnpm exec vite preview --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

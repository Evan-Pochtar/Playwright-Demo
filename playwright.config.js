// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    browserName: 'chromium',
    screenshot: 'only-on-failure',
  },
  reporter: 'html',
});
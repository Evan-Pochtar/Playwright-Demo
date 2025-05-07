// Import Playwright test libraries
const { test, expect } = require('@playwright/test');

const DEMO_URL = 'http://localhost:3000';

test.describe('Playwright Feature Demo', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running test: ${testInfo.title}`);
    await page.goto(DEMO_URL);
  });

  // Basic interactions: click and type
  test('should handle basic interactions', async ({ page }) => {
    // EXERCISE //
    await page.locator('#clickButton').click();
    await expect(page.locator('#clickResult')).toBeVisible();
    await page.locator('#textInput').fill('Hello Playwright');
    
    // EVALUATE //
    await expect(page.locator('#textOutput')).toHaveText('Hello Playwright');
  });

  // Form interactions
  test('should handle form submissions', async ({ page }) => {
    // SETUP //
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('password123');
    await page.locator('#dropdown').selectOption('option2');
    await page.locator('#agreement').check();
    await expect(page.locator('#agreement')).toBeChecked();
    
    // EXERCISE //
    await page.locator('#submitButton').click();
    
    // EVAULATE //
    await expect(page.locator('#formResult')).toBeVisible();
  });

  // Wait for network and dynamic content
  test('should handle AJAX content loading', async ({ page }) => {
    // EXERCISE //
    await page.locator('#loadDataButton').click();
    
    // EVALUATE //

    // Verify loading indicator shows up
    await expect(page.locator('#loading')).toBeVisible();
    
    // Wait for data table to appear
    await expect(page.locator('#dataTable')).toBeVisible({
      timeout: 5000 // Increase timeout for slower networks
    });
    
    // Verify table data content
    const rows = page.locator('#dataTable tbody tr');
    await expect(rows).toHaveCount(3);
    
    // Check specific cell content
    await expect(page.locator('#dataTable tbody tr').nth(1).locator('td').nth(1))
      .toHaveText('Item 2');
  });

  // File upload handling
  test('should handle file uploads', async ({ page }) => {
    // EXERCISE //
    await page.locator('#fileUpload').setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file content')
    });
    
    // EVALUATE //
    await expect(page.locator('#fileInfo')).toContainText('test-file.txt');
  });

  // Dialog handling
  test('should handle dialogs', async ({ page }) => {
    // SETUP //

    // Listen for dialog events
    page.on('dialog', async dialog => {
      console.log(`Dialog: ${dialog.type()}, ${dialog.message()}`);
      
      // Different handling based on dialog type
      if (dialog.type() === 'prompt') {
        await dialog.accept('Playwright User');
      } else {
        await dialog.accept();
      }
    });
    
    // EXERCISE & EVALUATE //
    await page.locator('#alertButton').click();
    await expect(page.locator('#dialogResult')).toContainText('Alert was acknowledged');
    
    await page.locator('#confirmButton').click();
    await expect(page.locator('#dialogResult')).toContainText('Confirm result: true');
    
    await page.locator('#promptButton').click();
    await expect(page.locator('#dialogResult')).toContainText('Prompt result: Playwright User');
  });

  // Iframe handling
  test('should interact with iframe content', async ({ page }) => {
    // SETUP //
    const frameHandle = await page.frameLocator('#demoFrame');
    
    // EXERCISE //
    await frameHandle.locator('#frameButton').click();
    
    // EVALUATE //
    await expect(frameHandle.locator('#frameResult')).toBeVisible();
    await expect(page.locator('#notification')).toBeVisible();
    await expect(page.locator('#notification')).toHaveText('Iframe button was clicked!');
  });

  // Screenshot and visual comparison
  test('should take screenshots for visual comparison', async ({ page }) => {
    // Take a screenshot of the entire page
    await page.screenshot({ path: 'screenshots/full-page.png' });
    
    // Take a screenshot of a specific element
    await page.locator('.section').first().screenshot({ 
      path: 'screenshots/section-element.png' 
    });
  });

  // Network interception
  test('should demonstrate network interception', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

    // Mock API responses
    await page.route('**/api/data', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 99, name: 'Mocked Item', value: 'Mocked Value' }
        ])
      });
    });
    
    await page.goto(DEMO_URL);
  });

  // Performance testing example
  test('should measure performance metrics', async ({ page }) => {
    // Start measuring
    const startTime = Date.now();
    
    await page.goto(DEMO_URL);
    
    // Get page load time
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // You can also use Playwright's built-in performance helpers
    const performanceTimings = await page.evaluate(() => JSON.stringify(window.performance.timing));
    console.log(`Performance timings: ${performanceTimings}`);
  });
});
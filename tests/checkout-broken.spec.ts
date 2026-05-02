import { expect, test } from '@playwright/test';

test('annual checkout is broken before the Annotator QA fix', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Checkout Plans' })).toBeVisible();
  await expect(page.locator('script[data-annotate-project-key]')).toHaveAttribute(
    'src',
    'https://annotate-dashboard.pages.dev/widget.js',
  );

  await page.getByRole('button', { name: 'Annual billing' }).click();
  const checkoutResponse = page.waitForResponse((response) => (
    response.request().method() === 'POST' && response.url().endsWith('/api/checkout/session')
  ));
  await page.getByRole('button', { name: 'Continue with annual' }).click();

  expect((await checkoutResponse).status()).toBe(500);
  await expect(page.getByRole('alert')).toHaveText('Stripe modal failed to open.');
  await expect(page.getByRole('dialog', { name: 'Stripe checkout' })).toHaveCount(0);
});


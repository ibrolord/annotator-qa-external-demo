import { expect, test } from '@playwright/test';

test('annual checkout opens Stripe after the Annotator QA fix', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Checkout Plans' })).toBeVisible();
  await page.getByRole('button', { name: 'Annual billing' }).click();
  const checkoutResponse = page.waitForResponse((response) => (
    response.request().method() === 'POST' && response.url().endsWith('/api/checkout/session')
  ));
  await page.getByRole('button', { name: 'Continue with annual' }).click();

  expect((await checkoutResponse).status()).toBe(200);
  await expect(page.getByRole('dialog', { name: 'Stripe checkout' })).toBeVisible();
  await expect(page.getByText('Stripe checkout ready.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open secure checkout' })).toHaveAttribute(
    'href',
    'https://checkout.example.test/session',
  );
  await expect(page.getByRole('alert')).toHaveCount(0);
});


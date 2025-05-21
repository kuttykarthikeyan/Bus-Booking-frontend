import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('kk');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test001@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('1234567890');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test001@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign in' }).click();
});
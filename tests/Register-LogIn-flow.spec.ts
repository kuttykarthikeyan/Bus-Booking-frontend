import { test, expect } from '@playwright/test';

test('User registration and login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await page.screenshot({ path: 'screenshots/Register-Login/01-registration-page.png', fullPage: true });

  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('karthi');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test001@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('12345');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('9999');
  
  await page.screenshot({ path: 'screenshots/Register-Login/02-registration-form-filled.png', fullPage: true });
  await page.getByRole('button', { name: 'Create Account' }).click();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('9999123456');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test001@om');
  
  await page.screenshot({ path: 'screenshots/Register-Login/03-registration-invalid-email.png', fullPage: true });
  await page.getByRole('button', { name: 'Create Account' }).click();

  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test001@gmail.com');
  await page.getByRole('button', { name: 'Create Account' }).click();

  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email Address' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test004@gmail.com');
  
  await page.screenshot({ path: 'screenshots/Register-Login/04-registration-corrected-email.png', fullPage: true });
  await page.getByRole('button', { name: 'Create Account' }).click();

  await page.screenshot({ path: 'screenshots/Register-Login/05-registration-attempt-result.png', fullPage: true });

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('tes');
  await page.getByRole('textbox', { name: 'Password' }).click();
  
  await page.screenshot({ path: 'screenshots/Register-Login/06-login-incomplete-data.png', fullPage: true });
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('tes@');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('tes@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  
  await page.screenshot({ path: 'screenshots/Register-Login/07-login-invalid-credentials.png', fullPage: true });
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Email address' }).press('ArrowRight');
  await page.getByRole('textbox', { name: 'Email address' }).fill('test004@gmail.com');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('12');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  
  await page.screenshot({ path: 'screenshots/Register-Login/08-login-correct-credentials.png', fullPage: true });
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.screenshot({ path: 'screenshots/Register-Login/09-login-result.png', fullPage: true });

  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screenshots/Register-Login/10-final-state.png', fullPage: true });
});
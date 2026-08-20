import { test, expect } from '@playwright/test';

test('добавляет ингредиент в конструктор', async ({ page }) => {
  console.log('ТЕСТ ЗАПУСТИЛСЯ');
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/'); 
  const ingredient = page.getByText('Краторная булка N-200i');

  await expect(ingredient).toBeVisible();
  const card = ingredient.locator('..');
  console.log(await ingredient.evaluate((el) => el.outerHTML));
  const addButton = card.getByRole('button', { name: 'Добавить' });
  await addButton.click();
  await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

  await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
});

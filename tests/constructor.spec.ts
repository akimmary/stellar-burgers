import { test, expect } from '@playwright/test';

test('добавляет ингредиент в конструктор', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const ingredient = page.getByText('Краторная булка N-200i');

  await expect(ingredient).toBeVisible();

  const card = ingredient.locator('..').locator('..');
  const addButton = card.getByRole('button', { name: 'Добавить' });

  await addButton.click();
  // ингредиент добавлен сверху
  await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
  // ингредиент добавлен снизу
  await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
});

test('добавляет начинку в конструктор', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const ingredient = page.getByText('Биокотлета из марсианской Магнолии');
  const card = ingredient.locator('..').locator('..');
  const addButton = card.getByRole('button', { name: 'Добавить' });

  await addButton.click();
  // начинка добавлена
  await expect(
    page.locator('span').filter({
      hasText: /^Биокотлета из марсианской Магнолии$/
    })
  ).toBeVisible();
});

test('добавляет соус в конструктор', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const ingredient = page.getByText('Соус Spicy-X');
  const card = ingredient.locator('..').locator('..');
  const addButton = card.getByRole('button', { name: 'Добавить' });

  await addButton.click();
  // соус добавлен
  await expect(
    page.locator('span').filter({
      hasText: /^Соус Spicy-X$/
    })
  ).toBeVisible();
});

test('неавторизованный пользователь перенаправляется на страницу входа', async ({
  page
}) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const orderButton = page.getByRole('button', {
    name: 'Оформить заказ'
  });

  await orderButton.click();
  // пользователь перенаправлен на страницу входа
  await expect(page).toHaveURL(/\/login/);
});

test('авторизованный пользователь может оформить заказ', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          email: 'test@test.ru',
          name: 'Test'
        }
      })
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'test burger',
        order: {
          number: 12345
        }
      })
    });
  });

  await page.goto('/');

  const ingredient = page.getByText('Краторная булка N-200i');

  const card = ingredient.locator('..').locator('..');

  const addButton = card.getByRole('button', { name: 'Добавить' });

  await addButton.click();

  const orderButton = page.getByRole('button', {
    name: 'Оформить заказ'
  });

  await orderButton.click();

  // заказ создан
  await expect(page.getByText('12345')).toBeVisible();

  // конструктор очистился
  await expect(page.getByText('Выберите булки')).toHaveCount(2);

  // закрываем модалку
  const closeButton = page.locator('#modals button');
  await closeButton.click();

  // модалка закрылась
  await expect(page.getByText('12345')).not.toBeVisible();
});

test('открывает модальное окно ингредиента', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const ingredient = page.getByText('Краторная булка N-200i');

  await ingredient.click();
   // модалка открылась
  await expect(
    page.locator('#modals').getByText('Калории, ккал')
  ).toBeVisible();
});

test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const ingredient = page.getByText('Краторная булка N-200i');

  await ingredient.click();
  // модалка открылась
  await expect(
    page.locator('#modals').getByText('Калории, ккал')
  ).toBeVisible();

  const closeButton = page.locator('#modals button');
  await expect(closeButton).toBeVisible();
  await closeButton.click();
  // модалка закрылась по клику по кнопке
  await expect(
    page.locator('#modals').getByText('Калории, ккал')
  ).not.toBeVisible();
});

test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har');
  await page.goto('/');

  const ingredient = page.getByText('Краторная булка N-200i');

  await ingredient.click();
  // модалка открылась
  await expect(
    page.locator('#modals').getByText('Калории, ккал')
  ).toBeVisible();
  const overlay = page.locator('#modals > div').last();

  await overlay.click({ position: { x: 5, y: 5 } });
  // модалка закрылась по клику по оверлею
  await expect(
    page.locator('#modals').getByText('Калории, ккал')
  ).not.toBeVisible();
});

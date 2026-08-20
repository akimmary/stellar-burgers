import { test, expect } from '@playwright/test';

test.describe('Добавление ингредиентов', () => {
  test('добавляет ингредиент в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const card = page.locator('li').filter({
      hasText: 'Краторная булка N-200i'
    });

    await expect(card).toBeVisible();

    const addButton = card.getByRole('button', {
      name: 'Добавить'
    });

    await addButton.click();

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', {
        name: 'Оформить заказ'
      })
    });

    // ингредиент добавлен сверху
    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    // ингредиент добавлен снизу
    await expect(
      constructor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();
  });

  test('добавляет начинку в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const card = page.locator('li').filter({
      hasText: 'Биокотлета из марсианской Магнолии'
    });

    await expect(card).toBeVisible();

    await card
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', {
        name: 'Оформить заказ'
      })
    });

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии', {
        exact: true
      })
    ).toBeVisible();
  });

  test('добавляет соус в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const card = page.locator('li').filter({
      hasText: 'Соус Spicy-X'
    });

    await expect(card).toBeVisible();

    await card
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', {
        name: 'Оформить заказ'
      })
    });

    await expect(
      constructor.getByText('Соус Spicy-X', {
        exact: true
      })
    ).toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test('неавторизованный пользователь перенаправляется на страницу входа', async ({
    page
  }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await orderButton.click();

    await expect(page).toHaveURL(/login/);
  });

  test('авторизованный пользователь может оформить заказ', async ({ page }) => {
    await page.routeFromHAR('tests/hars/order.har');

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');

    // Добавляем булку
    const bunCard = page.locator('li').filter({
      hasText: 'Краторная булка N-200i'
    });

    await bunCard
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    // Добавляем начинку
    const fillingCard = page.locator('li').filter({
      hasText: 'Биокотлета из марсианской Магнолии'
    });

    await fillingCard
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    // Добавляем соус
    const sauceCard = page.locator('li').filter({
      hasText: 'Соус Spicy-X'
    });

    await sauceCard
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await orderButton.click();

    // Заказ создан
    const orderModal = page.locator('#modals');

    await expect(
      orderModal.getByText('12345', {
        exact: true
      })
    ).toBeVisible();

    // Конструктор очистился
    const constructor = page.locator('section').filter({
      has: page.getByRole('button', {
        name: 'Оформить заказ'
      })
    });

    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);

    // Закрываем модалку
    const closeButton = orderModal.getByRole('button');

    await closeButton.click();

    // Модалка закрылась
    await expect(
      orderModal.getByText('12345', {
        exact: true
      })
    ).not.toBeVisible();
  });
});

test.describe('Модальные окна', () => {
  test('открывает модальное окно ингредиента', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const ingredient = page.getByText('Краторная булка N-200i', {
      exact: true
    });

    await ingredient.click();

    const modal = page.locator('#modals');

    // Проверяем, что открылась модалка именно выбранного ингредиента
    await expect(
      modal.getByText('Краторная булка N-200i', {
        exact: true
      })
    ).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const ingredient = page.getByText('Краторная булка N-200i', {
      exact: true
    });

    await ingredient.click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByText('Краторная булка N-200i', {
        exact: true
      })
    ).toBeVisible();

    const closeButton = modal.getByRole('button');

    await expect(closeButton).toBeVisible();

    await closeButton.click();

    await expect(
      modal.getByText('Краторная булка N-200i', {
        exact: true
      })
    ).not.toBeVisible();
  });

  test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har');

    await page.goto('/');

    const ingredient = page.getByText('Краторная булка N-200i', {
      exact: true
    });

    await ingredient.click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByText('Краторная булка N-200i', {
        exact: true
      })
    ).toBeVisible();

    const overlay = modal.locator('> div').last();

    await overlay.click({
      position: {
        x: 5,
        y: 5
      }
    });

    await expect(
      modal.getByText('Краторная булка N-200i', {
        exact: true
      })
    ).not.toBeVisible();
  });
});

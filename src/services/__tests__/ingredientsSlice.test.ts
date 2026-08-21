import reducer, { getIngredients, initialState } from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  it('возвращает начальное состояние для неизвестного action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('устанавливает isLoading в true при pending', () => {
    expect(reducer(undefined, getIngredients.pending(''))).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('сохраняет ингредиенты и выключает загрузку при fulfilled', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 100,
        price: 100,
        image: 'image',
        image_large: 'image',
        image_mobile: 'image'
      }
    ];
    const result = reducer(
      undefined,
      getIngredients.fulfilled(mockIngredients, '')
    );

    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.isLoading).toBe(false);
  });

  it('сохраняет ошибку и выключает загрузку при rejected', () => {
    const error = new Error('Ошибка загрузки');

    const result = reducer(undefined, getIngredients.rejected(error, ''));
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки');
  });
});

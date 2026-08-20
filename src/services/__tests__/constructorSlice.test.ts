import reducer, {
  addIngredient,
  setBun,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';

describe('constructorSlice', () => {
  it('возвращает начальное состояние для неизвестного action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('добавляет ингредиент в конструктор', () => {
    const ingredient = {
      id: '1',
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
    };
    const result = reducer(undefined, addIngredient(ingredient));
    expect(result.ingredients).toEqual([ingredient]);
  });

  it('устанавливает булку в конструктор', () => {
    const ingredient = {
      id: '1',
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
    };
    const result = reducer(undefined, setBun(ingredient));
    expect(result.bun).toEqual(ingredient);
  });

  it('удаляет ингредиент из конструктора', () => {
    const firstIngredient = {
      id: '1',
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
    };

    const secondIngredient = {
      id: '2',
      _id: '2',
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
    };

    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient]
    };

    const result = reducer(initialState, removeIngredient('1'));
    expect(result.ingredients).toEqual([secondIngredient]);
  });

  it('перемещает ингредиент вверх', () => {
    const firstIngredient = {
      id: '1',
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
    };

    const secondIngredient = {
      id: '2',
      _id: '2',
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
    };
    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient]
    };
    const result = reducer(
      initialState,
      moveIngredient({ index: 1, direction: 'up' })
    );
    expect(result.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('перемещает ингредиент вниз', () => {
    const firstIngredient = {
      id: '1',
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
    };

    const secondIngredient = {
      id: '2',
      _id: '2',
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
    };
    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient]
    };
    const result = reducer(
      initialState,
      moveIngredient({ index: 0, direction: 'down' })
    );
    expect(result.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('очищает конструктор', () => {
    const ingredient = {
      id: '1',
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
    };

    const bun = {
      id: '2',
      _id: '2',
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
    };
    const initialState = {
      bun: bun,
      ingredients: [ingredient]
    };
    const result = reducer(initialState, clearConstructor());
    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });
});

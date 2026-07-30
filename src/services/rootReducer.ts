import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import authReducer from './authSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer
});

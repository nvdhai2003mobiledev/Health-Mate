// store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../reducer/todosSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export default store;

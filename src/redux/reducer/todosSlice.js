import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    searchQuery: '',
    dayCount: 0, // Thêm state để đếm số ngày
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
      state.dayCount += 1; // Tăng số ngày mỗi khi thêm một Todo mới
    },
    editTodo: (state, action) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addTodo, editTodo, deleteTodo, setSearchQuery } = todosSlice.actions;

export default todosSlice.reducer;
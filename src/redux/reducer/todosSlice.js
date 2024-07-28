import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://665d671de88051d604066b34.mockapi.io/spirit'; // Thay bằng URL API của bạn

// Thunk actions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
});

export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
});

export const editTodo = createAsyncThunk('todos/editTodo', async (updatedTodo) => {
  const response = await fetch(`${API_URL}/${updatedTodo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTodo),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return id;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    searchQuery: '',
    dayCount: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.dayCount += 1;
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo.id !== action.payload);
      });
  },
});

export const { setSearchQuery } = todosSlice.actions;

export default todosSlice.reducer;

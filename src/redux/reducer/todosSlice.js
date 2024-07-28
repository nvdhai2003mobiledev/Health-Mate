// redux/reducer/todosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../FirebaseConfig';

// Thunk actions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const querySnapshot = await getDocs(collection(FIREBASE_DB, 'spirits'));
  const todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return todos;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo) => {
  const docRef = await addDoc(collection(FIREBASE_DB, 'spirits'), newTodo);
  return { id: docRef.id, ...newTodo };
});

export const editTodo = createAsyncThunk('todos/editTodo', async (updatedTodo) => {
  const todoDoc = doc(FIREBASE_DB, 'spirits', updatedTodo.id);
  await updateDoc(todoDoc, updatedTodo);
  return updatedTodo;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  const todoDoc = doc(FIREBASE_DB, 'spirits', id);
  await deleteDoc(todoDoc);
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

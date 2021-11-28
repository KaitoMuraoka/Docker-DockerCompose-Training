import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as C from '../../config/index'

const initialState = {
  tasksStatus: 'idle',
  deleteTaskStatus: 'idle',
  value: [],
}

export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetch',
  async (credentials) => {
    const res = await fetch(C.URL + '/api/v1/tasks', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    })
    const data = await res.json()
    return data
  }
)

export const deleteTaskAsync = createAsyncThunk(
  'tasks/delete',
  async (credentials) => {
    const res = await fetch(C.URL + '/api/v1/tasks/' + credentials.id, {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': credentials.csrfToken,
      },
      redirect: 'follow',
      body: JSON.stringify({ id: credentials.id }),
    })
    const data = res.json()
    return data
  }
)
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.tasksStatus = 'loading'
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.tasksStatus = 'idle'
        state.value = action.payload
      })
      .addCase(deleteTaskAsync.pending, (state) => {
        state.deleteTaskStatus = 'loading'
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        if (!action.payload.isSuccess) {
          alert('削除エラー')
        }
        state.deleteTaskStatus = 'idle'
      })
  },
})

export const selectTasksState = (state) => state.tasks.value
export const selectDeleteTaskState = (state) => state.tasks.deleteTaskStatus
export default tasksSlice.reducer

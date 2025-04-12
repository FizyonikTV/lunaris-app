import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const addRole = createAsyncThunk(
  'roles/addRole',
  async ({ serverId, roleData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/servers/${serverId}/roles`, roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editRole = createAsyncThunk(
  'roles/editRole',
  async ({ serverId, roleId, roleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/servers/${serverId}/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async ({ serverId, roleId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/servers/${serverId}/roles/${roleId}`);
      return roleId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(editRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role._id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
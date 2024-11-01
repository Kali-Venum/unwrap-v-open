import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import http from "../../services/api/http";

const initialState = {
  dashboardData: {},
  isFetchingDashboardData: false,
};

export const getProjectsCount = createAsyncThunk(
  "/dashboard/data",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.get("/dashboard/data", data);
      return response.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectsCount.pending, (state) => {
        state.isFetchingDashboardData = true;
      })
      .addCase(getProjectsCount.fulfilled, (state, { payload }) => {
        if (payload) {
          state.dashboardData = payload;
          state.isFetchingDashboardData = false;
        }
      })
      .addCase(getProjectsCount.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.isFetchingDashboardData = false;
      });
  },
});

export default dashboardSlice.reducer;

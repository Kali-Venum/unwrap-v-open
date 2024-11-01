import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import http from "../../services/api/http";

const initialState = {
  subscriptionPlans: [],
  isFetchingSubscriptionPlans: false,
  selectedSubcription: null,
};

export const getSubscriptionPlans = createAsyncThunk(
  "/stripe/get/subscription/plans",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.get("/stripe/get/subscription/plans", data);
      return response.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const subscription = createSlice({
  name: "subscription",
  initialState: initialState,
  reducers: {
    setSelectedSubscription: (state, action) => {
      state.selectedSubcription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.isFetchingSubscriptionPlans = true;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, { payload }) => {
        if (payload) {
          state.subscriptionPlans = payload;
          state.isFetchingSubscriptionPlans = false;
        }
      })
      .addCase(getSubscriptionPlans.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.isFetchingSubscriptionPlans = false;
      });
  },
});

export const { setSelectedSubscription } = subscription.actions;

export default subscription.reducer;

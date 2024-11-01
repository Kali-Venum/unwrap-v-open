import { configureStore } from "@reduxjs/toolkit";

// slices.
import authSlice from "../reducers/auth.slice";
import projectSlice from "../reducers/project.slice";
import dashboardSlice from "../reducers/dashboard.slice";
import subscriptionSlice from "../reducers/subscription.slice";

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
    projectReducer: projectSlice,
    dashboardReducer: dashboardSlice,
    subscriptionReducer: subscriptionSlice,
  },
});

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import http from "../../services/api/http";
import { logoutFunction, setLocalStorage } from "../../utils/localStorageUtils";
import catchAsync from "../../utils/catchAsync";

const initialState = {
  user: {},
};

export const refreshLoggedInUser = catchAsync(async (refreshToken) => {
  return http
    .post("/auth/token/refresh", refreshToken)
    .then((tokenData) => {
      if (tokenData !== undefined) {
        setLocalStorage({
          accessToken: tokenData?.serverResponse.result.data.access.token,
          refreshToken: tokenData?.serverResponse.result.data.refresh.token,
        });
        return tokenData;
      } else {
        logoutFunction();
        window.location.reload();
        return false;
      }
    })
    .catch(() => {
      logoutFunction();
      window.location.reload();
      return false;
    });
});

export const login = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/login", data);
      return response?.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "/auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/register", data);
      return response.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, () => {})
      .addCase(login.fulfilled, (state, { payload }) => {
        if (payload && payload?.tokens?.accessToken) {
          toast.success("You are successfully logged in.");
          state.user = payload?.data;
          localStorage.setItem("user", JSON.stringify(payload?.data));
          localStorage.setItem("accessToken", payload?.tokens?.accessToken);
          localStorage.setItem("refreshToken", payload?.tokens?.refreshToken);
        }
      })
      .addCase(login.rejected, (state, { payload }) => {
        toast.error(payload.message);
      });
    // .addCase(register.pending, (state) => {})
    // .addCase(register.fulfilled, (state, { payload }) => {
    //   if (payload) {
    //     state.user = payload?.data;
    //     localStorage.setItem("accessToken", payload?.tokens?.accessToken);
    //     localStorage.setItem("refreshToken", payload?.tokens?.refreshToken);
    //   }
    // })
    // .addCase(register.rejected, (state, { payload }) => {
    //   toast.error(payload.message);
    // });
  },
});

export default authSlice.reducer;

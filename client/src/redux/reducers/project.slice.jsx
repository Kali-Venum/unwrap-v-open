import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import http from "../../services/api/http";

const initialState = {
  projects: [],
  isFetchingProjects: false,
  models: [],
};

export const createANewProject = createAsyncThunk(
  "/project/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/project/create", data.values);
      if (response?.result) {
        const projectId = response.result.data._id;
        data.dispatch(getAllProjectsOfAUser());
        data.navigate(`/project/${projectId}`);
        // data.handlePopUp()
        return response.result;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllProjectsOfAUser = createAsyncThunk(
  "/project/list",
  async (data, { rejectWithValue }) => {
    try {
      const { pageNumber, dataPerPage } = data;
      const response = await http.get(
        `/project/list?pageNumber=${pageNumber ? pageNumber : 1}&dataPerPage=${
          dataPerPage ? dataPerPage : 8
        }`
      );
      return response.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllModels = createAsyncThunk(
  "/model/list",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post("/model/list", data);
      // console.log("response.result",response.result);
      return response.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createANewProject.pending, (state) => {})
      .addCase(createANewProject.fulfilled, (state, { payload }) => {
        if (payload) {
          //   toast.success("Success");
          //   state.user = payload?.data;
          //   localStorage.setItem("user", JSON.stringify(payload?.data));
          //   localStorage.setItem("accessToken", payload?.tokens?.accessToken);
          //   localStorage.setItem("refreshToken", payload?.tokens?.refreshToken);
        }
      })
      .addCase(createANewProject.rejected, (state, { payload }) => {
        toast.error(payload.message);
      })
      .addCase(getAllProjectsOfAUser.pending, (state) => {
        state.isFetchingProjects = true;
      })
      .addCase(getAllProjectsOfAUser.fulfilled, (state, { payload }) => {
        if (payload) {
          state.isFetchingProjects = false;
          state.projects = payload.data;
          state.totalDataCount = payload.totalDataCount;
          state.pageNumber = payload.pageNumber;
          state.dataPerPage = payload.dataPerPage;
        }
      })
      .addCase(getAllProjectsOfAUser.rejected, (state, { payload }) => {
        toast.error(payload.message);
        state.isFetchingProjects = false;
      })
      .addCase(getAllModels.pending, (state) => {})
      .addCase(getAllModels.fulfilled, (state, { payload }) => {
        if (payload) {
          state.models = payload.data;
          //   toast.success("Success");
          //   state.user = payload?.data;
          //   localStorage.setItem("user", JSON.stringify(payload?.data));
          //   localStorage.setItem("accessToken", payload?.tokens?.accessToken);
          //   localStorage.setItem("refreshToken", payload?.tokens?.refreshToken);
        }
      })
      .addCase(getAllModels.rejected, (state, { payload }) => {
        toast.error(payload.message);
      });
  },
});

export default projectSlice.reducer;

import axios from "axios";
import { API_URL } from "../../constants/config";
import { ResponseValidator } from "../../schemas/validator/response.validator";
import { toast } from "react-toastify";
import { logout } from "../../utils/localStorageUtils";
import { refreshLoggedInUser } from "../../redux/reducers/auth.slice";

/***
 * *axios request configs
 */
axios.interceptors.request.use((config) => {
  config.baseURL = API_URL;
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  } else {
    axios.defaults.headers.common.Authorization &&
      delete axios.defaults.headers.common.Authorization;
    config.headers = axios.defaults.headers.common;
  }
  return config;
});

/***
 * *axios response configs
 */
axios.interceptors.response.use(
  async (result) => {
    let response = await ResponseValidator({
      result: result.data?.result,
    });
    if (response) {
      return result.data;
    }
  },
  async (error) => {
    const expectedErrorRefreshToken =
      error.response && error.response.status === 401;

    if (expectedErrorRefreshToken) {
      const checkLogin = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const res = await refreshLoggedInUser({ refreshToken: refreshToken });

          if (!res) {
            logout();
            return false;
          } else {
            error.config.headers["Authorization"] =
              "Bearer " + res.access.token;
            if (error.config?.data) {
              error.config.data = JSON.parse(error.config.data);
            }
            error.config.baseURL = undefined;
            // Return actual call response.
            return await axios.request(error.config);
          }
        } else {
          // window.location.reload();
          // logout();
          return false;
        }
      };

      let response = await checkLogin();

      if (response) {
        return Promise.resolve(response);
      }
    }

    const expectedError =
      error.response.status &&
      error.response.status >= 400 &&
      error.response.status <= 500;

    if (!expectedError) {
      logout();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      toast.error(error.response.data?.message);
      return error.response.data;
    }
  }
);

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};

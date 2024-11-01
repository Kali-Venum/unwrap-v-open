export const clearLocalStorage = () => {
    localStorage.clear();
  };
  
  export const logoutFunction = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.clear()
  };
  
  export const setLocalStorage = (tokens) => {
    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };
  
  export const logout = () => {
    logoutFunction();
    // window.location.reload();
  }
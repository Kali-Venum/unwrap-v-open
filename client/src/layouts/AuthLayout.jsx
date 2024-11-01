import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    if (!accessToken || user?.role !== "user") {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;

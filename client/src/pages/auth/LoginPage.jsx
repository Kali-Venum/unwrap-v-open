import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/auth.slice";
import { BiShow, BiHide } from "react-icons/bi";
import SubmitButton from "../../components/buttons/SubmitButton";
import { Link } from "react-router-dom";
import { LoginSchema } from "../../schemas/auth/login.schema";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../services/api/http";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: LoginSchema,
      onSubmit: async (values) => {
        const value = await dispatch(
          login({ email: values.email, password: values.password })
        );
        if (value.payload.data && value.payload.data?.isVerified) {
          navigate("/dashboard");
        } else if (value.payload.data && !value.payload.data?.isVerified) {
          try {
            const response = await http.post(`/auth/request-verification`, {
              email: values.email,
            });
            if (response?.serverResponse?.code === 200) {
              toast.success(response.serverResponse?.message);
              navigate("/verify-email", { state: { email: values.email } });
            }
          } catch (error) {
            console.log(error, "err");
          }
        }
      },
    });

  return (
    <div className=" md:h-[100vh] h-[100vh] flex flex-col justify-center items-center px-6 pt-8 lg:w-[100vw] lg:h-[100vh] bg-[#add8e65d]">
      <div className=" shadow-xl rounded-3xl overflow-hidden md:mt-0 w-[90%] h-[90vh] xl:p-0 flex">
        <div className="h-[100%] hidden md:w-[50%] md:block lg:w-[50%] xl:w-[50%] bg-white-color">
          <div className="flex items-center justify-center mt-10 mb-10">
            <img src="/static/logo.png" style={{ width: "30%" }} alt="" />
          </div>
          <img src="/static/login.png" height={"100%"} alt="" />
        </div>
        <div className="w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%] bg-[#335aa2] p-6 sm:p-8 lg:p-10  text-[#fff] flex justify-center items-center">
          <div className=" w-[100%]  ">
            <h2 className=" text-[2rem] lg:text-4xl xl:text-[30px] md:text-3xl font-bold text-white-color text-center">
              Login
            </h2>
            <form
              className="lg:mt-8 w-[100%] sm:w-[90%] md:w-[85%] lg:w-[95%] xl:w-[80%] space-y-6 mx-auto"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="text-sm  block mb-2 font-medium"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-[#fff] border border-[#d5d5d5] text-[#000] sm:text-sm focus:[#e46f33] focus:[#e46f33] block w-full p-2.5 rounded-[7px]"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email ? (
                  <p className="text-[#FF0000] text-sm">{`${errors.email}`}</p>
                ) : null}
              </div>
              <div className="signinPasswordn md:mt-4 mt-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium  block mb-2"
                >
                  Your Password
                </label>
                <div className="flex border border-gray-300 rounded-lg relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="bg-[#fff] text-[#000] sm:text-sm block w-full p-2.5 rounded-[7px] pr-[35px]"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <button
                    type="button"
                    className="view-password-button px-2 absolute right-0 top-3 text-black-color"
                    onClick={() => setShowPassword((state) => !state)}
                  >
                    {showPassword ? (
                      <BiShow size={"20px"} />
                    ) : (
                      <BiHide size={"20px"} />
                    )}
                  </button>
                </div>
                {errors.password && touched.password ? (
                  <p className="text-[#FF0000] text-sm">{`${errors.password}`}</p>
                ) : null}
              </div>
              <div className="flex justify-between">
                <div>
                  <Link
                    className="underline block text-sm/[18px] lg:mt-0 md:mt-0 mt-4"
                    to="/forget-password"
                  >
                    Forget Password
                  </Link>
                </div>
              </div>
              <div className="text-center ">
                <SubmitButton buttonText="Login" />
                <div className="flex  items-center justify-center  mt-4 gap-1 ">
                  <p>Don&apos;t have an account?</p>
                  <Link
                    className="underline block text-sm/[18px]  lg:mt-0 md:mt-0 "
                    to="/register"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

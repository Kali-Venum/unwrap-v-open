import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { BiShow, BiHide } from "react-icons/bi";
import SubmitButton from "../../components/buttons/SubmitButton";
import { Link } from "react-router-dom";
import { RegistrationSchema } from "../../schemas/auth/registration.schema";
import { useNavigate } from "react-router-dom";
import { register } from "../../redux/reducers/auth.slice";

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      validationSchema: RegistrationSchema,
      onSubmit: async (values) => {
        const value = await dispatch(
          register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          })
        );

        console.log(value, "value");

        if (value.payload.data !== null) {
          navigate("/verify-email", { state: { email: values.email } });
        }
        // action.resetForm();
      },
    });

  return (
    <div className="mx-auto md:h-[100vh] h-[100vh] flex flex-col justify-center items-center px-6  pt:mt-0 lg:w-[100vw] lg:h-[100vh] bg-[#add8e65d]">
      <div className="shadow-xl rounded-3xl overflow-hidden md:mt-0 w-[90%]  h-[95vh] xl:p-0 flex">
        <div className=" h-[100%] hidden md:w-[50%] md:block lg:w-[50%] xl:w-[50%] w-[50%] bg-white-color">
          <div className=" flex items-center justify-center mt-10 mb-10">
            <img src="/static/logo.png" style={{ width: "30%" }} alt="" />
          </div>
          <img src="/static/login.png" height={"100%"} alt="" />
        </div>
        <div className="w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%] bg-[#335aa2] p-8 sm:p-8 lg:p-16  text-[#fff] flex justify-center items-center">
          <div className=" w-[100%]">
            <h2 className="text-[1.3rem] lg:text-4xl xl:text-[30px] md:text-3xl font-bold text-white-color text-center">
              Register
            </h2>
            <form
              className="lg:mt-8 w-[100%] sm:w-[90%] md:w-[85%] lg:w-[95%] xl:w-[80%] space-y-2 mx-auto"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="text-sm  block mb-1 font-medium"
                >
                  Your First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="bg-[#fff] border border-[#d5d5d5] text-[#000] sm:text-sm focus:[#e46f33] focus:[#e46f33] block w-full p-2 rounded-[7px]"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.firstName && touched.firstName ? (
                  <p className="text-[#FF0000] text-sm">{`${errors.firstName}`}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="text-sm  block mb-1 font-medium"
                >
                  Your Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="bg-[#fff] border border-[#d5d5d5] text-[#000] sm:text-sm focus:[#e46f33] focus:[#e46f33] block w-full p-2 rounded-[7px]"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.lastName && touched.lastName ? (
                  <p className="text-[#FF0000] text-sm">{`${errors.lastName}`}</p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm  block mb-1 font-medium"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-[#fff] border border-[#d5d5d5] text-[#000] sm:text-sm focus:[#e46f33] focus:[#e46f33] block w-full p-2 rounded-[7px]"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                {errors.email && touched.email ? (
                  <p className="text-[#FF0000] text-sm">{`${errors.email}`}</p>
                ) : null}
              </div>
              <div className="signinPasswordn md:mt-4 mt-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium  block mb-1"
                >
                  Your Password
                </label>
                <div className="flex border border-gray-300 rounded-lg relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="bg-[#fff] text-[#000] sm:text-sm block w-full p-2 rounded-[7px] pr-[35px]"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />

                  <button
                    type="button"
                    className="view-password-button px-2 absolute right-0 top-2 text-black-color"
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
              <div className="text-center">
                <SubmitButton buttonText="Register" />
                <div className="flex  items-center justify-center mt-4 gap-1">
                  <p>Already have an account?</p>
                  <Link
                    className="underline block text-sm/[18px]  lg:mt-0 md:mt-0 "
                    to="/login"
                  >
                    Login
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

export default RegistrationPage;

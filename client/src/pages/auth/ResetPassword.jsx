import { useState } from "react";
import SubmitButton from "../../components/buttons/SubmitButton";
import { BiShow, BiHide } from "react-icons/bi";
import http from "../../services/api/http";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import PropsType from "prop-types";

//Step 1
const SubmitEmail = ({ onNextStep }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post(`/auth/forgot-password`, { email });
      console.log(response, "response");
      if (response?.serverResponse?.code === 200) {
        toast.success(response.serverResponse?.message);
        onNextStep(email);
      }
    } catch (error) {
      console.log(error, "err");
      toast.error("Email does not exits.");
    }
  };

  return (
    <div className=" md:h-[100vh] h-[100vh] flex flex-col justify-center items-center px-6 pt-8 lg:w-[100vw] lg:h-[100vh] bg-[#add8e65d]">
      <div className=" shadow-xl rounded-3xl overflow-hidden md:mt-0 w-[90%] h-[90vh] xl:p-0 flex">
        <div className="h-[100%] hidden md:w-[50%] md:block lg:w-[50%] xl:w-[50%] bg-white-color">
          <div className="flex items-center justify-center mt-10 mb-10">
            <img src="/static/logo.png" style={{ width: "30%" }} alt="" />
          </div>
          <img src="/static/login.png" height={"100%"} alt="" />
        </div>
        <div className="w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%] bg-[#335aa2] p-6 sm:p-6 lg:p-10  text-[#fff] flex justify-center  items-center">
          <div className="w-[100%]">
            <h2 className="text-[2rem] lg:text-4xl xl:text-[30px] md:text-3xl font-bold text-white-color text-center">
              Forgot Password
            </h2>
            <form
              className=" lg:mt-8  w-[100%] sm:w-[90%] md:w-[85%] lg:w-[95%] xl:w-[80%] space-y-6 mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="pt-5">
                <label
                  htmlFor="email"
                  className="text-sm  block mb-2 font-medium"
                >
                  Your Registered Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-[#fff] border border-[#d5d5d5] text-[#000] sm:text-sm focus:[#e46f33] focus:[#e46f33] block w-full p-2.5 rounded-[7px]"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                {/* {errors.email && touched.email ? (
                <p className="text-[#FF0000] text-sm">{`${errors.email}`}</p>
              ) : null} */}
              </div>
              <div className="text-center">
                <SubmitButton buttonText="Generate OTP" />
              </div>
            </form>
            <div className="flex  items-center justify-center  mt-4 gap-1 ">
              <p>Back to</p>
              <Link
                className="underline block text-base/[18px] lg:mt-0 md:mt-0 "
                to="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SubmitEmail.propTypes = {
  onNextStep: PropsType.func.isRequired,
};

//Step 2
const StepTwo = ({ email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    // Send OTP and new password to backend
    try {
      const response = await http.post(`/auth/reset-password`, {
        email,
        otp,
        password,
      });
      // console.log(response);
      if (response?.serverResponse?.code === 200) {
        toast.success("Password Reset Sucessfully");
        // Reset fields and navigate to next step
        setOtp("");
        setpassword("");
        setConfirmPassword("");
        setPasswordsMatch(true);
        navigate("/login");
      }
    } catch (error) {
      // toast.error("")
      console.log(error, "err");
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post(`/auth/forgot-password`, { email });
      console.log(response, "response");
      if (response?.serverResponse?.code === 200) {
        toast.success(response.serverResponse?.message);
      }
    } catch (error) {
      console.log(error, "err");
    }
  };

  const handlePasswordVisibility = (passwordType) => {
    if (passwordType === "new") {
      setShowpassword(!showpassword);
    } else if (passwordType === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlepasswordChange = (e) => {
    setpassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

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
          <div className=" w-[100%]">
            <h2 className="text-[2rem] lg:text-4xl xl:text-[30px] md:text-3xl font-bold text-white-color text-center">
              Forgot Password
            </h2>
            <form
              className=" w-[100%] sm:w-[90%] md:w-[85%] lg:w-[95%] xl:w-[80%] lg:mt-4 mx-auto"
              onSubmit={handleSubmit}
            >
              <div>
                <label htmlFor="otp" className="text-sm block mb-2 font-medium">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="bg-[#fff] border border-[#d5d5d5] text-[#000] sm:text-sm focus:[#e46f33] block w-full p-2.5 rounded-[7px]"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                />
              </div>
              <div className="md:mt-4 mt-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium block mb-2"
                >
                  New Password
                </label>
                <div className="flex border border-gray-300 rounded-lg relative">
                  <input
                    type={showpassword ? "text" : "password"}
                    id="password"
                    className="bg-[#fff] text-[#000] sm:text-sm block w-full p-2.5 rounded-[7px] pr-[35px]"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={handlepasswordChange}
                  />
                  <button
                    type="button"
                    className="view-password-button px-2 absolute right-0 top-3 text-black-color"
                    onClick={() => handlePasswordVisibility("new")}
                  >
                    {showpassword ? (
                      <BiShow size={"20px"} />
                    ) : (
                      <BiHide size={"20px"} />
                    )}
                  </button>
                </div>
              </div>
              <div className="md:mt-4 mt-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium block mb-2"
                >
                  Confirm Password
                </label>
                <div className="flex border border-gray-300 rounded-lg relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="bg-[#fff] text-[#000] sm:text-sm block w-full p-2.5 rounded-[7px] pr-[35px]"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <button
                    type="button"
                    className="view-password-button px-2 absolute right-0 top-3 text-black-color"
                    onClick={() => handlePasswordVisibility("confirm")}
                  >
                    {showConfirmPassword ? (
                      <BiShow size={"20px"} />
                    ) : (
                      <BiHide size={"20px"} />
                    )}
                  </button>
                </div>
              </div>
              {!passwordsMatch && (
                <p className="text-red-500 text-sm p-1">
                  Passwords do not match!
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <Link onClick={handleResendOTP} className="text-sm underline">
                  Resend OTP
                </Link>
              </div>
              <div className="text-center mt-4">
                <SubmitButton buttonText="Submit" />
              </div>
            </form>
            <div className="flex  items-center justify-center  mt-4 gap-1 ">
              <p>Back to</p>
              <Link
                className="underline block text-base/[18px] lg:mt-0 md:mt-0 "
                to="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StepTwo.propTypes = {
  email: PropsType.string.isRequired,
};

//Main Function
const ResetPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");

  const handleNextStep = (email) => {
    setCurrentStep(currentStep + 1);
    setEmail(email);
  };
  return (
    <div className=" bg-[#add8e65d]">
      {currentStep == 0 && <SubmitEmail onNextStep={handleNextStep} />}
      {currentStep == 1 && <StepTwo email={email} />}
    </div>
  );
};

export default ResetPassword;

import { useState } from "react";
import SubmitButton from "../../components/buttons/SubmitButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import http from "../../services/api/http";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp) {
      try {
        const response = await http.post(`/auth/verify-user`, {
          email: location.state.email,
          otp: otp,
        });
        if (response?.serverResponse?.code === 200) {
          toast.success(response.serverResponse?.message);
          navigate("/login");
        }
      } catch (error) {
        toast.error("Something is wrong!");
      }
    } else {
      toast.error("Please enter OTP");
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post(`/auth/request-verification`, {
        email: location.state.email,
      });
      if (response?.serverResponse?.code === 200) {
        toast.success(response.serverResponse?.message);
      }
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  function formatEmail() {
    var splitEmail = location.state.email.split("@");
    var domain = splitEmail[1];
    var name = splitEmail[0];
    return name.substring(0, 3).concat("*********@").concat(domain);
  }

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
            <div className="relative flex min-h-screen flex-col justify-center overflow-hidden  py-12">
              <div className="relative px-6  mx-auto w-full max-w-lg rounded-2xl ">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-10 ">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="font-semibold text-3xl">
                      <p>Email Verification</p>
                    </div>
                    <div className="flex flex-row text-sm font-medium text-gray-100">
                      <p>We have sent a code to your email {formatEmail()}</p>
                    </div>
                  </div>
                  <div>
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col space-y-5 font-semibold">
                        <div className="flex flex-row items-center justify-center mx-auto w-full space-x-3">
                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            inputType="tel"
                            renderSeparator={
                              <span style={{ margin: "4px" }}></span>
                            }
                            renderInput={(props) => <input {...props} />}
                            inputStyle="border border-transparent rounded !w-full h-8 sm:h-10 md:h-8 lg:h-12 text-sm text-black font-medium"
                            focusStyle={{
                              border: "1px solid #CFD3DB",
                            }}
                          />
                        </div>

                        <div className="flex flex-col space-y-5 text-center">
                          <div>
                            <SubmitButton buttonText="Verify Email" />
                          </div>

                          <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-100">
                            <p>Didn&apos;t recieve code?</p>{" "}
                            <Link
                              onClick={handleResendOTP}
                              className="flex flex-row items-center text-white underline"
                              rel="noopener noreferrer"
                            >
                              Resend
                            </Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

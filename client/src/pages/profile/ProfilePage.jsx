import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(loggedUser);
  }, []);

  const getUserInitials = () => {
    if (userData) {
      let initial = "";
      initial += userData.firstName.charAt(0);
      initial += userData.lastName.charAt(0);
      return initial;
    }
    return "U";
  };

  return (
    <div className="">
      <div className="md:flex md:flex-row  sm:flex-col w-[100%] justify-around ">
        <div className="pt-5 lg:w-[50%]  md:w-[50%] sm:w-[100%] flex h-[100%]  justify-center">
          <div className="bg-[#fff] h-[70%] w-[85%] rounded-xl">
            <div
              className="relative bg-cover bg-center mt-4 h-[80px] w-[90%] mx-auto rounded-xl"
              style={{
                backgroundImage: `url(${"/static/banner-profile.png"})`,
              }}
            >
              <div className="bg-[#4c974c] w-16 h-16 rounded-full flex justify-center items-center absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-7">
                <h1 className="text-[#fff] p-3 text-xl">{getUserInitials()}</h1>
              </div>
            </div>
            <div className="mt-10 ">
              <h1 className="text-center text-[20px] text-[#333333] font-semibold">
                {userData?.firstName} {userData?.lastName}
              </h1>
            </div>
            <div>
              <h3 className="text-sm font-semibold ml-3">Account Setting</h3>
              <span className="text-[12px] ml-3 text-[#999999]">
                Here you can view user account information.
              </span>
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="email" className="ml-3 text-sm ">
                Email
              </label>
              <input
                className="m-2 p-3 outline-none border border-[#999999] rounded-lg text-sm"
                type="email"
                name="email"
                id="email"
                value={userData?.email}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[50%]  flex justify-center items-center">
          <div className="sm:mx-5 lg:m-0 md:m-0 mx-10">
            <img src="/static/BannerSide-profile.png" alt="pic" height={80} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

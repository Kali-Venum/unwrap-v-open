import { useEffect, useState } from "react";
import { IoHomeSharp, IoMenuSharp } from "react-icons/io5";
import { Link, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography, Breadcrumbs } from "@material-tailwind/react";

const Navbar = ({ toggleSidebar }) => {
  const [userData, setUserData] = useState(null);
  const { pathname } = useLocation();
  const params = useParams();
  const [layout] = pathname.split("/").filter((el) => el !== "");

  const getUserInitials = () => {
    if (userData) {
      let initial = "";
      initial += userData.firstName.charAt(0);
      initial += userData.lastName.charAt(0);
      return initial;
    }
    return "U";
  };
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(loggedUser);
  }, []);

  return (
    <nav className="w-full top-0 z-40 px-6 flex md:flex-row items-center justify-between bg-white/10  backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="capitalize">
          <Breadcrumbs className={`bg-transparent p-0 transition-all `}>
            <IoHomeSharp className="text-base" />
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all text-blue-gray-900 hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            {Object.keys(params).map(
              (p) =>
                p !== "projectId" || !p.includes("Id") && (
                  <Typography
                    key={p}
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {params[p] ?? ""}
                  </Typography>
                )
            )}
          </Breadcrumbs>
        </div>
        {/* <div className="h-6 pt-1">
          <Link className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
            Pages{"  "}
          </Link>
          <Link className="text-sm font-bold  capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white">
            {location.pathname}
          </Link>
        </div> */}
      </div>
      <div className="relative mt-[3px] flex h-[61px] max-w-[150px] flex-grow items-center justify-end gap-1 rounded-fullpx-2 py-2 dark:!bg-navy-800 dark:shadow-none md:w-[150px] md:flex-grow-0 md:gap-1 xl:w-[100px] xl:gap-2 ">
        <span
          onClick={toggleSidebar}
          className="flex  cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden me-3 "
        >
          <IoMenuSharp className="text-2xl" />
        </span>
        <div className="relative flex">
          <div className="flex">
            <div className="cursor-pointer sb-avatar sb-avatar--text">
              <div
                className="cursor-pointer sb-avatar__text bg-primary text-secondary h-10 w-10 p-2 rounded-full"
                title={`${userData?.firstName} ${userData?.lastName}`}
              >
                <div className="text-center">
                  <span className="uppercase">{getUserInitials()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="py-2 top-8 -left-[180px] w-max absolute z-10 origin-top-right transition-all duration-300 ease-in-out scale-0">
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none ">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white ">
                    👋 Hey, Theknight1
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 "></div>
              <div className="flex flex-col p-4">
                <p className="cursor-pointer text-sm text-gray-800 dark:text-white hover:dark:text-white">
                  Profile
                </p>
                <p
                  href=" "
                  className="mt-3 cursor-pointer text-sm font-medium text-red-500 hover:text-red-500"
                >
                  Log Out
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

Navbar.propTypes = {
  toggleSidebar: PropTypes.func,
};

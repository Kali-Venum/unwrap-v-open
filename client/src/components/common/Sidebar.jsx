// import React from "react";
// import { IoMdHome } from "react-icons/io";
// import { FaUser } from "react-icons/fa6";
// import { GiFilmProjector } from "react-icons/gi";
// import { Link, useLocation } from "react-router-dom";

// const Sidebar = ({ isOpen }) => {
//   const location = useLocation();

//   return (
//     <div className={`h-screen lg:w-[100%] md:w-[100%] sm:w-[100%] w-0 flex flex-col fixed top-0 left-0 transition-all duration-300 ${!isOpen ? "translate-x-0" : "-translate-x-full"}`}>
//       <p className=' border-b w-[100%] border-[#999999]'></p>
//       <div className="sm:py-2 sm:px-0 md:py-3 md:px-1 lg:w-[100%] w-[0%] md:w-[100%] sm:w-[100%]">
//         <div className='lg:w-[100%] md:px-2 xl:px-4 xl:py-4 hidden sm:block md:w-[100%] sm:w-[100%]'>
//           <ul>
//             <Link to={"/dashboard"}>
//               <li>
//                 <div className='flex items-center cursor-pointer mt-2 ml-5 mb-4 gap-5 text-[#999999] hover:translate-x-2 transition-all ease-in'>
//                   <span className='text-2xl'>
//                     <IoMdHome style={{ color: location.pathname === '/dashboard' ? 'blue' : '#999999' }} />
//                   </span>
//                   <h1 className={`${location.pathname === '/dashboard' ? 'text-[#000]' : 'text-[#999999]'} font-semibold`}>Dashboard</h1>
//                 </div>
//               </li>
//             </Link>
//             <Link to={"/project"}>
//               <li>
//                 <div className='flex items-center cursor-pointer mt-2 ml-5 mb-4 gap-5 text-[#999999] hover:translate-x-2 transition-all ease-in'>
//                   <span className='text-2xl'>
//                     <GiFilmProjector style={{ color: location.pathname === '/project' ? 'blue' : '#999999' }} />
//                   </span>
//                   <h1 className={`${location.pathname === '/project' ? 'text-[#000]' : 'text-[#999999]'} font-semibold`}>Project</h1>
//                 </div>
//               </li>
//             </Link>
//             <Link to={"/profile"}>
//               <li>
//                 <div className='flex items-center mt-2 ml-5 cursor-pointer gap-5  text-[#999999] hover:translate-x-2 transition-all ease-in'>
//                   <span className='text-2xl'>
//                     <FaUser style={{ color: location.pathname === '/profile' ? 'blue' : '#999999' }} />
//                   </span>
//                   <h1 className={`${location.pathname === '/profile' ? 'text-[#000]' : 'text-[#999999]'} font-semibold`}>Profile</h1>
//                 </div>
//               </li>
//             </Link>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { IoMdHome, IoMdPerson, IoMdLogOut } from "react-icons/io";
import { GiFilmProjector } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

import { logout } from "../../utils/localStorageUtils";
import { IoCard, IoClose, IoWarningOutline } from "react-icons/io5";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const width = screen.width;

  const [showConfirmPopup, SetshowConfirmPopup] = useState(false);

  const handlePopUp = () => {
    SetshowConfirmPopup((pre) => !pre);
  };

  return (
    <>
      <Drawer
      className="fixed max-h-screen h-full"
        overlay={width > 720 ? false : true}
        size={260}
        open={isOpen}
        onClose={toggleSidebar}
        dismiss={{
          outsidePress: width > 720 ? false : true,
        }}
      >
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
          <div className="mb-2 flex items- justify-center gap-4 p-4">
            <img src="/static/logo.png" alt="" width={150} height={150} />
          </div>
          <List
            onClick={() => {
              if (width < 720) {
                toggleSidebar();
              }
            }}
          >
            <Link to={"/dashboard"}>
              <ListItem selected={location.pathname === "/dashboard"}>
                <ListItemPrefix>
                  <IoMdHome className="h-6 w-6 text-primary" />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </Link>
            <Link to={"/project"}>
              <ListItem selected={location.pathname.includes("/project")}>
                <ListItemPrefix>
                  <GiFilmProjector className="h-6 w-6 text-primary" />
                </ListItemPrefix>
                Project
              </ListItem>
            </Link>
            <Link to={"/subscription"}>
              <ListItem selected={location.pathname.includes("/subscription")}>
                <ListItemPrefix>
                  <IoCard className="h-6 w-6 text-primary" />
                </ListItemPrefix>
                Subscription
              </ListItem>
            </Link>
            <hr className="my-2 border-blue-gray-50" />
            <Link to={"/profile"}>
              <ListItem selected={location.pathname === "/profile"}>
                <ListItemPrefix>
                  <IoMdPerson className="h-6 w-6 text-primary" />
                </ListItemPrefix>
                Profile
              </ListItem>
            </Link>
            <ListItem
              onClick={() => {
                SetshowConfirmPopup(true);
              }}
            >
              <ListItemPrefix>
                <IoMdLogOut className="h-6 w-6 text-primary" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
      <Dialog size="xs" open={showConfirmPopup} handler={handlePopUp}>
        <DialogHeader className="flex justify-between">
          <div>Confirm logout</div>
          <div className="hover:bg-[#D3D3D3] rounded-full ]">
            <IoClose
              onClick={handlePopUp}
              className="text-gray-9000 m-1 text-xl cursor-pointer"
            />
          </div>
        </DialogHeader>
        <DialogBody>
          <p className="flex justify-center items-center">
            <IoWarningOutline className="text-5xl text-yellow-600 pe-3" /> Are
            you sure you want to logout?
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outlined"
            color="red"
            onClick={handlePopUp}
            className="mr-1"
          >
            <span>No</span>
          </Button>
          <Button
            variant="outlined"
            className="border-primary text-primary"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <span>Yes</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import NavbarComponent from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pass, setPass] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    if (!accessToken || user?.role !== "user") {
      navigate("/login");
    } else {
      setPass(true);
    }
  }, []);

  const width = screen.width;

  useEffect(() => {
    if (width > 720) {
      setSidebarOpen(true);
    }
  }, [width]);

  // useEffect to handle sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Close sidebar when screen size is small (sm breakpoint)
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially
    handleResize();

    // Cleanup function for removing event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-x-auto bg-[#f4f7fe]">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      {/* Main Content */}
      <div
        className={`flex-1 relative transition-all delay-100 max-h-screen h-full overflow-y-auto ${
          !sidebarOpen || width < 720 ? "ml-[0px]" : "ml-[260px]"
        }`}
      >
        <div className="h-16 sticky top-0 z-20">
          <NavbarComponent
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className="py-4 px-6">
          <div className="w-full">
            <div>{pass && children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;

UserLayout.propTypes = {
  children: PropTypes.element,
};

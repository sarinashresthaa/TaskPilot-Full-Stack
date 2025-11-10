import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSidebarItems } from "../../constant";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { useAuth, useLogout } from "../../lib/auth/authQueries";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: authData } = useAuth();
  const logout = useLogout();

  const userRole = authData?.user?.role || 'team_member';
  const mainItems = getSidebarItems(userRole);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate("/", { replace: true }); // Go to root, which will redirect to /home for logged out users
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("isLogin");
      navigate("/", { replace: true });
    }
  };
  return (
    <div className="w-[250px] h-dvh border-r border-gray-200 flex flex-col justify-between bg-[linear-gradient(180deg,_#7B2FF7,_#F107A3)] text-white">
      <div>
        <div className="font-bold text-2xl text-center py-5">
          <h1>🚀TaskPilot</h1>
        </div>

        <div className="font-semibold px-6 grid gap-2">
          {mainItems.map((item, index) => {
            const isActive = item.href === location.pathname;
            return (
              <div
                key={index}
                className={`inline-flex items-center gap-2 p-2 cursor-pointer ${
                  isActive ? "bg-[#e4d9e2] text-[#7D3BEC] rounded-md font-bold" : ""
                }`}
                onClick={()=> navigate(item.href)}
              >
                {item.icon}
                <Link to={item.href}>{item.name}</Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="font-semibold px-6 grid mb-6">
        <Link to="/settings" className="inline-flex justify-start items-center gap-2 p-2 hover:bg-[#e4d9e2] hover:text-[#7D3BEC]   rounded-md">
          <FaUser />
          Account
        </Link>
        <div
          className="inline-flex justify-start items-center gap-2 p-2 cursor-pointer hover:bg-[#e4d9e2]  hover:text-red-600  rounded-md"
          onClick={handleLogout}
        >
          <TbLogout />
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

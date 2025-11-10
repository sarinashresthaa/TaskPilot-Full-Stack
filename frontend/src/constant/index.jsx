import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { BiTask } from "react-icons/bi";
import { GoPeople, GoPerson } from "react-icons/go";
import { FaChartLine } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

// Helper function to get sidebar items based on user role
export const getSidebarItems = (userRole) => {
    const baseItems = [
        { id: 0, name: "Dashboard", icon: <LuLayoutDashboard />, href: "/dashboard", roles: ["team_member", "project_manager", "admin"] },
        { id: 1, name: "Projects", icon: <HiOutlineSquare3Stack3D />, href: "/projects", roles: ["project_manager", "admin", "team_member"] },
        { id: 2, name: "Tasks", icon: <BiTask />, href: "/tasks", roles: ["team_member", "project_manager", "admin"] },
        { id: 3, name: "Team", icon: <GoPeople />, href: "/team", roles: [ "admin","project_manager"] },
        { id: 4, name: "Analytics", icon: <FaChartLine />, href: "/analytics", roles: ["admin","project_manager"] },
    ];
    return baseItems.filter(item => item.roles.includes(userRole));
};

// Backward compatibility - default sidebar items
export const sidebar_items = [
    { id: 1, name: "Dashboard", icon: <LuLayoutDashboard />, href: "/dashboard" },
    { id: 2, name: "Projects", icon: <HiOutlineSquare3Stack3D />, href: "/projects" },
    { id: 3, name: "Tasks", icon: <BiTask />, href: "/tasks" },
    { id: 4, name: "Team", icon: <GoPeople />, href: "/team" },
    { id: 5, name: "Analytics", icon: <FaChartLine />, href: "/analytics" },
    { id: 6, name: "Account", icon: <GoPerson />, href: "/settings" },
];

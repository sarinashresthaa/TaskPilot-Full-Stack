import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";

const menus = [
  { name: "Home", href: "/home" },
  { name: "Features", href: "/features" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();
  return (
    <div className="flex justify-between items-center px-4 py-3 shadow-md bg-white">
      <div className="text-xl font-bold">
        🚀 Task<span className="text-[#7D3BEC]">Pilot</span>
      </div>
      <div className="flex gap-6 text-lg font-semibold">
        {menus?.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={
              location.pathname === item.href
                ? "border-b-3 border-[#7D3BEC] text-[#7D3BEC] font-bold"
                : ""
            }>
            {item.name}
          </Link>
        ))}
      </div>
      <div>
        <Button label="Login" onClick={() => navigate("/login")} />
      </div>
    </div>
  );
};

export default Header;

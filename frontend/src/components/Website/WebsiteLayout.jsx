import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const WebsiteLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <div className="sticky top-0">
        <Header />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default WebsiteLayout;

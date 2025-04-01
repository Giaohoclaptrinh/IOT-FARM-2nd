import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/SideBar/Sidebar";
import TopBar from "@/components/TopBar and Search/TopBar";
import ChatBox from "@/components/Chatbox/Chatbox";

const Home = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/sign-in" || location.pathname === "/sign-up";

  return (
    <div className=" flex-1 flex flex-col bg-gray-100  ">
      {!isAuthPage && <TopBar />}

      <div className="overflow-hidden h-screen flex">
        {!isAuthPage && <Sidebar />}

        {/* Nội dung trang, các trang con sẽ hiển thị ở đây */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>

        {/* Chatbox luôn xuất hiện ở góc phải */}
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Home;

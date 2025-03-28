import React, { useState } from "react";
import TopBar from "../components/TopBar and Search/TopBar";
import RoleManager from "../components/Role/RoleManager";

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6">
      {/* <TopBar onSearch={setSearchTerm} /> */}
      {/* <h1 className="text-3xl font-bold mb-4">Quản lý người dùng</h1> */}
      <RoleManager searchTerm={searchTerm} />
    </div>
  );
};

export default UserPage;
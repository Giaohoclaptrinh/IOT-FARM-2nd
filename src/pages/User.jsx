import React from "react";
import RoleManager from "../components/RoleManager";

const UserPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Quản lý người dùng</h1>
      <RoleManager />
    </div>
  );
};

export default UserPage;

import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    alert("Đăng nhập thành công!");
    navigate("/dashboards"); // Chuyển hướng sau khi đăng nhập
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">🔑 Đăng nhập</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              className="border rounded-lg p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Mật khẩu:</label>
            <input
              type="password"
              className="border rounded-lg p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

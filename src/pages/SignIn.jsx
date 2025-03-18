import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/db.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import PropTypes from "prop-types";

const SignIn = ({ setShowLayout }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setShowLayout(true); // Hiển thị Sidebar sau khi đăng nhập thành công
      navigate("/dashboards");
    } catch (error) {
      console.log.error
      console.error("Error during sign up:", error);
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Đăng Nhập</h1>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 w-full rounded hover:bg-blue-600 transition">
            Đăng Nhập
          </button>
        </form>
        <p className="mt-4 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  setShowLayout: PropTypes.func.isRequired, // Xác định kiểu dữ liệu
};


export default SignIn;

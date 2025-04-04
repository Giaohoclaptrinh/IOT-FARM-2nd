import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/db.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import PropTypes from "prop-types";

const SignUp = ({ setShowLayout }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // Mặc định vai trò là 'user'
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Cập nhật tên hiển thị cho user trên Firebase Auth
      await updateProfile(user, { displayName: name });

      // Lưu thông tin user vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
        role: role,
      });

      if (setShowLayout) setShowLayout(true); // Kiểm tra trước khi gọi
      navigate("/dashboards");
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("Đăng ký thất bại! Kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Đăng Ký</h1>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Tên của bạn"
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          {/* <select
            className="border p-2 w-full rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select> */}

          <button type="submit" className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600 transition">
            Đăng Ký
          </button>
        </form>
        <p className="mt-4 text-center">
          Đã có tài khoản?{" "}
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  setShowLayout: PropTypes.func,
};

SignUp.defaultProps = {
  setShowLayout: () => {}, 
};

export default SignUp;

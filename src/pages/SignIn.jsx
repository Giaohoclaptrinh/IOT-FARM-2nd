// import React, { useState } from "react";
// import { useNavigate  } from "react-router-dom";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignIn = (e) => {
//     e.preventDefault();
//     alert("Đăng nhập thành công!");
//     navigate("/dashboards"); // Chuyển hướng sau khi đăng nhập
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white shadow-md rounded-lg p-6 w-96">
//         <h2 className="text-2xl font-bold mb-4">🔑 Đăng nhập</h2>
//         <form onSubmit={handleSignIn}>
//           <div className="mb-4">
//             <label className="block mb-1">Email:</label>
//             <input
//               type="email"
//               className="border rounded-lg p-2 w-full"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block mb-1">Mật khẩu:</label>
//             <input
//               type="password"
//               className="border rounded-lg p-2 w-full"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
//           >
//             Đăng nhập
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
import React, { useState } from "react";
import { auth } from "../firebase/db.config"; // Import Firebase Auth
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Điều hướng sau khi đăng nhập thành công
    } catch (error) {
      setError("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

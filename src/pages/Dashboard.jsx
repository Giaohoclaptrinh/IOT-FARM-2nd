import React, { useEffect, useState } from "react";
import { auth } from "../firebase/db.config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Theo dõi trạng thái đăng nhập
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/sign-in");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && <p>Xin chào, {user.email}!</p>}
    </div>
  );
};

export default Dashboard;

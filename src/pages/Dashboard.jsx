import React, { useEffect, useState } from "react";
import { auth } from "../firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/db.config";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Lấy dữ liệu từ Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        }
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Chào mừng, {userName || "Người dùng"}! 👋</h1>
      <p className="mt-2 text-gray-600">Đây là bảng điều khiển của bạn.</p>
    </div>
  );
};



export default Dashboard;

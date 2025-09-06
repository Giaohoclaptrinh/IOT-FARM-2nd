import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/db.config"; // Đảm bảo bạn đã cấu hình Firebase đúng cách

const DeviceOverview = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
            setUserRole(userDoc.data().role || 'client');
          }

          // Lấy danh sách thiết bị
          const devicesQuery = query(
            collection(db, "devices"),
            where("userId", "==", currentUser.uid)
          );

          const unsubscribeDevices = onSnapshot(devicesQuery, (snapshot) => {
            const devicesList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDevices(devicesList);
          });

          // Cleanup khi không cần theo dõi nữa
          return () => unsubscribeDevices();
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []); // Chạy một lần khi component mount

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold mb-2">Tổng quan thiết bị</h2>
      <p className="text-gray-700">
        Hiện có <strong>{devices.length}</strong> thiết bị trong hệ thống.
      </p>
    </div>
  );
};

export default DeviceOverview;

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from 'react'
import { db, auth } from "../firebase/db.config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import HomeWrap from "./HomeWrap";

const Devices = () => {
  const navigate = useNavigate();
  const [deviceData, setDeviceData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Theo dõi người dùng hiện tại
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Lấy danh sách thiết bị
  useEffect(() => {
    if (!currentUser) return;

    const deviceRef = collection(db, "devices");
    const isAdmin = currentUser.email === "1@gmail.com"; // Đổi thành email admin thực tế

    const q = isAdmin
      ? deviceRef
      : query(deviceRef, where("userUID", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDeviceData(snapshot.docs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Xoá thiết bị
  const handleDeleteDevice = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá thiết bị này?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "devices", id));
      setDeviceData((prev) => prev.filter((device) => device.id !== id));
    } catch (error) {
      console.error("Lỗi khi xoá thiết bị:", error);
    }
  };

  // ➜ Điều hướng khi nhấn "Sửa"
  const handleWatch = (uid) => {
    navigate(`/controlsdevices/${uid}`);
  };

  return (
    <HomeWrap>
      <div className="font-seconds border rounded-md">
        <table className="table-auto border-collapse divide-y relative text-left w-full">
          <thead>
            <tr className="bg-slate-200 font-semibold text-md ">
              <th className="py-2 rounded-tl-md pl-4 ">Name Device</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
              <th className="py-2 rounded-tr-md"></th>
            </tr>
          </thead>
          <tbody>
            {deviceData.map((item) => {
              const data = item.data();
              const createdAt = data.createdAt?.toDate();
              const formattedDate = createdAt
                ? `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`
                : "N/A";

              return (
                <tr key={item.id} className="border-b last:border-none">
                  <td className=" pl-4 font-semibold">{data.name}</td>
                  <td className="text-gray-600">{formattedDate}</td>
                  <td className="text-gray-600">{data.status}</td>
                  <td className="text-gray-600 py-2 space-x-2">
                    <button
                      className="bg-blue-500 px-4 py-1 rounded-md text-white"
                      onClick={() => handleWatch(item.id)} // 🔁 chuyển trang tại đây
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 px-4 py-1 rounded-md text-white"
                      onClick={() => handleDeleteDevice(item.id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </HomeWrap>
  );
};

export default Devices;

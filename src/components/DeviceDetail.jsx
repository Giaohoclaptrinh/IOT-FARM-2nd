import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/db.config";

const DeviceDetail = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const docRef = doc(db, "devices", id); // ⚡ Kiểm tra tên collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDevice(docSnap.data());
        } else {
          console.error("Không tìm thấy thiết bị!");
        }
      } catch (error) {
        console.error("Lỗi khi tải thiết bị:", error);
      }
      setLoading(false);
    };

    fetchDevice();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!device) return <p>Không tìm thấy thiết bị.</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">{device.name}</h1>
      <p>Mô tả: {device.description}</p>
      <p>Trạng thái: {device.status}</p>
    </div>
  );
};

export default DeviceDetail;

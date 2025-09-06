import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase/db.config";
import { collection, addDoc } from "firebase/firestore";
import OverLay from "../Utilities/OverLay";
import { IoMdClose } from "react-icons/io";

const AddDevice = ({ onClose, onDeviceAdded }) => {
    const [deviceName, setDeviceName] = useState("");
    const [status, setStatus] = useState("Online");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [enableShow, setEnableShow] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Bạn cần đăng nhập để thêm thiết bị!");
            return;
        }

        if (!deviceName.trim() || !location.trim() || !description.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "devices"), {
                name: deviceName.trim(),
                status,
                location: location.trim(),
                description: description.trim(),
                userUID: user.uid,
                createdAt: new Date(),
            });

            alert("Thiết bị đã được thêm thành công!");

            if (typeof onDeviceAdded === "function") {
                onDeviceAdded(); // Gọi callback cập nhật danh sách
            } else {
                console.warn("onDeviceAdded không phải là một hàm");
            }
        } catch (error) {
            console.error("Lỗi khi thêm thiết bị:", error);
        } finally {
            setLoading(false);
            onClose(); // Đóng form
        }
    };

    return (
        <OverLay onClose={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4 w-96">
                <h2
                    className="text-xl text-center bg-gradient-to-r  from-indigo-400 to-blue-400
                text-white py-2 rounded-2xl shadow font-seconds
                 font-bold mb-4"
                >
                    Thêm thiết bị mới
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4  text-center"
                >
                    <input
                        type="text"
                        placeholder="Tên thiết bị"
                        className="border  border-gray-300  p-2 w-full  rounded-md focus:border-blue-400 "
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Vị trí thiết bị"
                        className="border  border-gray-300  p-2 w-full  rounded-md focus:border-blue-400 "
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Giới thiệu thiết bị"
                        className="border  border-gray-300  p-2 w-full  rounded-md focus:border-blue-400 "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <select
                        className="border  border-gray-300  p-2 w-full  rounded-md focus:border-blue-400 "
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                    </select>
                    <button
                        type="submit"
                        className={`p-2 w-full text-white rounded-md ${
                            loading
                                ? "bg-gray-400"
                                : "bg-blue-500 hover:bg-blue-700"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                </form>
                <button
                    type="button"
                    className="h-8 w-8  mt-1 mr-1
                     flex-center inline-block bg-gray-300  rounded-full text-gray-500
                     absolute
                     top-0
                      right-0
                      hover:opacity-90
                    "
                    onClick={onClose}
                >
                    <IoMdClose className="text-2xl text-black  rounded-full   mx-auto" />
                </button>
            </div>
        </OverLay>
    );
};

export default AddDevice;

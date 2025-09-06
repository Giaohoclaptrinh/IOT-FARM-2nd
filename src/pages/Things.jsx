// src/pages/Things.jsx
import React, { useEffect, useState } from "react";
import HomeWrap from "@/pages/HomeWrap";
import { HiOutlineXMark } from "react-icons/hi2";
import {
    addDeviceIntoPage,
    CreatePage,
    deletePageid,
    getDeviceListByuser,
    getDevices,
    getDeviceofThingPage,
    getPageList,
    getDeviceData,
    removeDeviceFromThingPage, // <== Thêm dòng này
} from "@/components/Database/Services";
import OverLay from "@/components/Utilities/OverLay";
import { Link, useParams } from "react-router-dom";
import { auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import ShowDevicePage from "./ShowDevicePage";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import randomColor from "randomcolor";

const Things = () => {
    const { id: pageId } = useParams();
    const [devices, setDevices] = useState([]);
    const [pageName, setPageName] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [addDevice, setAddDevice] = useState(false);
    const [deviceListOfThings, setDeviceListOfThings] = useState([]);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [allUserDevices, setAllUserDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [compareData, setCompareData] = useState([]);

    const notify = (message) => window.alert(message);

   const handleCreatePage = async (e) => {
    e.preventDefault();
    try {
        const uid = auth.currentUser.uid;
        const message = await CreatePage(pageName, uid); 
        notify(message);
        const pages = await getPageList(uid);
        setPageList(pages);
        setPageName("");
        setShowOverlay(false);
    } catch (error) {
        console.error("Error creating page:", error);
        notify("Tạo trang thất bại");
    }
};

const handleDeletePage = async (id) => {
    try {
        const uid = auth.currentUser.uid;
        await deletePageid(id, uid); 
        const updated = await getPageList(uid);
        setPageList(updated);
        notify("Xóa trang thành công");
    } catch (error) {
        console.error("Error deleting page:", error);
        notify("Xóa trang thất bại");
    }
};


    useEffect(() => {
        getPageList()
            .then(setPageList)
            .catch((error) => console.error("Error fetching page list:", error));
    }, []);

   

const fetchDevices = async () => {
    try {
        const allDevices = await getDevices(); // Tất cả thiết bị trong hệ thống
        console.log("📦 Tất cả thiết bị:", allDevices);

        const user = auth.currentUser;
        if (!user || !pageId) return;

        const addedIds = await getDeviceofThingPage(pageId, user.uid); // ID của thiết bị đã gán vào trang
        console.log("✅ Thiết bị đã thêm vào trang:", addedIds);

        const addedDevices = allDevices.filter((d) => addedIds.includes(d.idDevice));
        setDeviceListOfThings(addedDevices);

        const addedIdSet = new Set(addedIds);
        const available = allDevices.filter((d) => !addedIdSet.has(d.idDevice));
        setAvailableDevices(available);

        // Nếu cần dùng riêng mảng đầy đủ:
        setAllUserDevices(allDevices);
    } catch (error) {
        console.error("Lỗi khi fetch devices:", error);
    }
};



            useEffect(() => {
            if (!pageId) return;

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) fetchDevices(user.uid);
            });

            return () => {
                unsubscribe();
                setDeviceListOfThings([]);
                setAvailableDevices([]);
            };
        }, [pageId]);

        

    useEffect(() => {
        const fetchMultipleDeviceData = async () => {
            if (selectedDevices.length < 2) return;

            try {
                const results = await Promise.all(
                    selectedDevices.map(async (deviceId) => {
                        const data = await getDeviceData(deviceId);
                        return { deviceId, data };
                    })
                );
                setCompareData(results);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu so sánh nhiều thiết bị:", error);
            }
        };

        fetchMultipleDeviceData();
    }, [selectedDevices]);

    const renderCreatePageOverlay = () => (
        <OverLay onClose={() => setShowOverlay(false)}>
            <div className="w-96 p-4">
                <form onSubmit={handleCreatePage}>
                    <div className="border rounded-md h-16 flex items-center bg-white p-2 focus-within:border-blue-400">
                        <input
                            placeholder="Nhập tên trang . . ."
                            className="w-full"
                            type="text"
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mt-4 text-xl text-white font-semibold"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </OverLay>
    );

    const renderAddDeviceOverlay = () => (
        <OverLay onClose={() => setAddDevice(false)}>
            <div className="w-sm h-[600px] bg-white rounded-2xl p-4 overflow-auto">
                <table className="w-full">
                    <thead className="bg-slate-500 text-white">
                        <tr>
                            <th className="text-left px-6">Name</th>
                            <th className="text-left px-6">Action</th> {/* chỉ còn 2 cột */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                        {availableDevices.map((item) => (
                            <tr key={item.idDevice}>
                                <td className="px-6">{item.name || item.idDevice || "Không có tên"}</td>
                                <td className="px-6">
                                    <button
                                        className="btn-seconds px-2"
                                        onClick={async () => {
                                            try {
                                                await addDeviceIntoPage(
                                                    pageId,
                                                    item.idDevice,
                                                    auth.currentUser.uid
                                                );
                                                notify("Thêm thiết bị thành công");
                                                await fetchDevices(); // gọi lại fetch sau khi thêm
                                                setAddDevice(false); // đóng overlay sau khi thêm
                                            } catch (error) {
                                                console.error("Error adding device:", error);
                                                notify("Thêm thiết bị thất bại");
                                            }
                                        }}
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                {availableDevices.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                        Không có thiết bị nào để thêm.
                    </div>
                )}
            </div>
        </OverLay>
    );

    const renderPageList = () => (
        <HomeWrap>
            <div>
                <button onClick={() => setShowOverlay(true)} className="btn-primary">
                    Create Page
                </button>
            </div>

            <div className="flex flex-col justify-center mt-4 gap-y-2">
                {pageList.map((item) => (
                    <div
                        key={item.idpage}
                        className="flex justify-between items-center py-2 bg-gray-100 px-2 rounded-md border hover:bg-gray-200"
                    >
                        <Link className="w-full text-md" to={`/things/${item.idpage}`}>
                            {item.NamePage}
                        </Link>
                        <button
                            onClick={() => handleDeletePage(item.idpage)}
                            className="rounded-xs bg-sky-500 p-1"
                        >
                            <HiOutlineXMark className="text-2xl text-white" />
                        </button>
                    </div>
                ))}
            </div>

            {showOverlay && renderCreatePageOverlay()}
        </HomeWrap>
    );

    const renderDevicePage = () => (
        <HomeWrap>
            <div className="w-full py-3 text-end">
                <button onClick={() => setAddDevice(true)} className="btn-primary">
                    Thêm thiết bị vào trang
                </button>
            </div>

            {addDevice && renderAddDeviceOverlay()}

            {deviceListOfThings.length === 0 ? (
                <div className="text-center text-gray-400 my-10">
                    Chưa có thiết bị nào trong trang này.<br />
                    Hãy nhấn <span className="font-semibold text-blue-600">"Thêm thiết bị vào trang"</span> để bắt đầu.
                </div>
            ) : (
                <div className="my-6">
                    <h2 className="text-lg font-semibold mb-2">Danh sách thiết bị trong trang:</h2>
                    <div className="overflow-auto rounded-lg border border-gray-200">
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên thiết bị</th>
                                    
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {deviceListOfThings.map((device) => (
                                    <tr key={device.idDevice}>
                                        <td className="px-6 py-4">{device.id}</td>
                                        {/* <td className="px-6 py-4">{device.status}</td> */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await removeDeviceFromThingPage(pageId, device.idDevice, auth.currentUser.uid);
                                                        notify("Đã xoá thiết bị khỏi trang");
                                                        fetchDevices(auth.currentUser.uid);
                                                    } catch (err) {
                                                        console.error("Lỗi khi xoá thiết bị:", err);
                                                        notify("Xoá thiết bị thất bại");
                                                    }
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {deviceListOfThings.length >= 2 && (
                <div className="my-6">
                    <h2 className="text-lg font-semibold mb-2">Chọn các thiết bị để so sánh:</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {deviceListOfThings.map((device) => {
                            const isSelected = selectedDevices.includes(device.idDevice);
                            return (
                                <button
                                    key={device.idDevice}
                                    onClick={() => {
                                        setSelectedDevices((prev) =>
                                            isSelected
                                                ? prev.filter((id) => id !== device.idDevice)
                                                : [...prev, device.idDevice]
                                        );
                                    }}
                                    className={`px-3 py-1 rounded-full border ${
                                        isSelected ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                                >
                                    {device.name}
                                </button>
                            );
                        })}
                    </div>

                    {compareData.length >= 2 && (
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {compareData.map((device) => (
                                        <Line
                                            key={device.deviceId}
                                            type="monotone"
                                            data={device.data}
                                            dataKey="value"
                                            name={`Thiết bị ${device.deviceId}`}
                                            stroke={randomColor({ luminosity: "dark" })}
                                            dot={false}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
            <ShowDevicePage key={deviceListOfThings.length} />
        </HomeWrap>
    );
    

    return pageId ? renderDevicePage() : renderPageList();

};

export default Things;

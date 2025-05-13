import React, { useEffect, useState } from "react";
import HomeWrap from "@/pages/HomeWrap";
import PageList from "@/components/Things/PageList";
import PageDetail from "@/components/Things/PageDetail";
import { HiOutlineXMark } from "react-icons/hi2";
import {
    addDeviceIntoPage,
    CreatePage,
    deletePageid,
    getDeviceListByuser,
    getDeviceofThingPage,
    getPageList,
} from "@/components/Database/Services";
import OverLay from "@/components/Utilities/OverLay";
import { Link, useParams } from "react-router-dom";
import { auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import ShowDevicePage from "./ShowDevicePage";

const Things = () => {
    const { id: pageId } = useParams();                // Đặt alias rõ ràng
    const [selectedPageId, setSelectedPageId] = useState(pageId || null);
    const [pageName, setPageName] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [addDevice, setAddDevice] = useState(false);
    const [deviceListOfThings, setDeviceListOfThings] = useState([]);

    // Thay Nt_alert bằng window.alert
    const notify = (message) => window.alert(message);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const message = await CreatePage(pageName);
            notify(message);
            const pages = await getPageList();
            setPageList(pages);
            setShowOverlay(false);
        } catch (error) {
            console.error("Error creating page:", error);
            notify("Tạo trang thất bại");
        }
    };

    // Lấy danh sách Page
    useEffect(() => {
        (async () => {
            try {
                const pages = await getPageList();
                setPageList(pages);
            } catch (error) {
                console.error("Error fetching page list:", error);
            }
        })();
    }, []);

    // Lấy danh sách thiết bị của Page
    useEffect(() => {
        if (!pageId) return;
        const fetchDevices = async () => {
            if (auth.currentUser) {
                try {
                    const data = await getDeviceofThingPage(pageId, auth.currentUser.uid);
                    setDeviceListOfThings(data);
                } catch (error) {
                    console.error("Error fetching device list:", error);
                }
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, fetchDevices);

        return () => {
            unsubscribeAuth();
            setDeviceListOfThings([]);
        };
    }, [pageId]);

    // Nội dung khi !pageId: danh sách Pages
    if (!pageId) {
        return (
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
                            className="flex-center justify-between py-2 bg-gray-100 px-2 rounded-md border border-gray-300/70 hover:bg-gray-200"
                        >
                            <Link className="w-full text-md" to={`/things/${item.idpage}`}>
                                {item.NamePage}
                            </Link>
                            <button
                                onClick={async () => {
                                    try {
                                        await deletePageid(item.idpage);
                                        const pages = await getPageList();
                                        setPageList(pages);
                                        notify("Xóa trang thành công");
                                    } catch (error) {
                                        console.error("Error deleting page:", error);
                                        notify("Xóa trang thất bại");
                                    }
                                }}
                                className="rounded-xs bg-sky-500 p-1"
                            >
                                <HiOutlineXMark className="text-2xl font-semibold text-white" />
                            </button>
                        </div>
                    ))}
                </div>

                {showOverlay && (
                    <OverLay onClose={() => setShowOverlay(false)}>
                        <div className="w-96 h-44 p-4">
                            <form onSubmit={handleSubmit} className="w-full h-full">
                                <div className="w-full border rounded-md border-gray-300 h-16 flex items-center bg-white focus-within:border-blue-400 p-2">
                                    <input
                                        placeholder="Nhập tên trang . . ."
                                        className="w-full caret-gray-500"
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
                )}
            </HomeWrap>
        );
    }

    // Nội dung khi có pageId: hiển thị chi tiết Page
    return (
        <HomeWrap>
            <div className="w-full py-3 text-end">
                <button
                    onClick={async () => {
                        setAddDevice(true);
                        if (auth.currentUser) {
                            try {
                                const list = await getDeviceListByuser(auth.currentUser.uid);
                                setDeviceListOfThings(list);
                            } catch (error) {
                                console.error("Error fetching devices:", error);
                            }
                        }
                    }}
                    className="btn-primary"
                >
                    Thêm thiết bị vào trang
                </button>
            </div>
            {addDevice && (
                <OverLay onClose={() => setAddDevice(false)}>
                    <div className="w-sm h-[600px] bg-white rounded-2xl p-4 overflow-auto">
                        <table className="w-full">
                            <thead className="bg-slate-500 text-white">
                                <tr>
                                    <th className="text-left px-6">Name</th>
                                    <th className="text-left px-6">Status</th>
                                    <th className="text-left px-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                                {deviceListOfThings.map((item) => (
                                    <tr key={item.idDevice}>
                                        <td className="px-6">{item.name}</td>
                                        <td className="px-6">{item.status}</td>
                                        <td className="px-6">
                                            <button
                                                className="btn-seconds px-2"
                                                onClick={async () => {
                                                    try {
                                                        await addDeviceIntoPage(pageId, item.idDevice, auth.currentUser.uid);
                                                        notify("Thêm thiết bị thành công");
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
                    </div>
                </OverLay>
            )}
            <div>
                <ShowDevicePage deviceIdList={deviceListOfThings} />
            </div>
        </HomeWrap>
    );
};

export default Things;

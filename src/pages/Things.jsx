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
import { addPage } from "@/utils/FireStoreUtils";
import OverLay from "@/components/Utilities/OverLay";
import { Link, useParams } from "react-router-dom";
import { auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import ShowDevicePage from "./ShowDevicePage";

const Things = () => {
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [pageName, setPageName] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [addDevice, setAddDevice] = useState(false);
    const [deviceListOfThings, setDeviceListOfThings] = useState([]);
    const notificationStatus = new Nt_alert().build();
    const url = useParams();
    console.log("params", url.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const message = await CreatePage(pageName);
            notificationStatus.createNode(message);
            const page = await getPageList();
            setPageList(page);
        } catch (error) {
            console.error('Error creating page:', error);
        }
    };

    useEffect(() => {
        const fetchPageList = async () => {
            try {
                const page = await getPageList();
                setPageList(page);
            } catch (error) {
                console.error('Error fetching page list:', error);
            }
        };
        fetchPageList();
    }, []);

    useEffect(() => {
        const fetchDevices = async () => {
            if (auth.currentUser && url.id) {
                try {
                    const data = await getDeviceofThingPage(url.id, auth.currentUser.uid);
                    setDeviceListOfThings(data);
                } catch (error) {
                    console.error('Error fetching device list:', error);
                }
            }
        };

        onAuthStateChanged(auth, fetchDevices);

        // Cleanup on unmount
        return () => {
            setDeviceListOfThings([]); // Clear devices on unmount or change
        };
    }, [url.id]);

    return !url.id ? (
        <HomeWrap>
            <div>
                <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className="btn-primary"
                >
                    Create Page
                </button>
            </div>
            <div className="flex flex-col justify-center mt-4 gap-y-2">
                {pageList.map((item, index) => (
                    <div
                        key={index}
                        className="flex-center justify-between py-2 bg-gray-100 px-2 rounded-md border border-gray-300/70 hover:bg-gray-200"
                    >
                        <Link
                            className="w-full text-md"
                            to={`/things/${item.NamePage}`}
                        >
                            {item.NamePage}
                        </Link>
                        <span className="flex-center">
                            <button
                                onClick={async () => {
                                    try {
                                        await deletePageid(item.idpage);
                                        const page = await getPageList();
                                        setPageList(page);
                                    } catch (error) {
                                        console.error('Error deleting page:', error);
                                    }
                                }}
                                className="rounded-xs bg-sky-500"
                            >
                                <HiOutlineXMark className="text-2xl font-semibold text-white" />
                            </button>
                        </span>
                    </div>
                ))}
            </div>

            {showOverlay && (
                <OverLay onClose={() => setShowOverlay(!showOverlay)}>
                    <div className="w-96 h-44 p-4">
                        <form onSubmit={handleSubmit} className="size-full">
                            <div className="w-full border rounded-md border-gray-300 h-16 flex items-center bg-white focus-within:border-blue-400 p-2">
                                <input
                                    placeholder="Nhập tên trang . . ."
                                    className="size-full caret-gray-500"
                                    type="text"
                                    value={pageName}
                                    onChange={(e) => setPageName(e.target.value)}
                                />
                            </div>
                            <div className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mt-4 items-center flex-center text-xl text-white font-semibold">
                                <button className="size-full" type="submit">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </OverLay>
            )}
        </HomeWrap>
    ) : (
        <HomeWrap>
            <div className="w-full py-3 text-end">
                <button
                    onClick={async () => {
                        setAddDevice(true);
                        try {
                            const getList = await getDeviceListByuser(auth.currentUser.uid);
                            setDeviceListOfThings(getList);
                        } catch (error) {
                            console.error('Error fetching devices:', error);
                        }
                    }}
                    className="btn-primary"
                >
                    Thêm thiết bị vào trang
                </button>
            </div>
            {addDevice && (
                <OverLay onClose={() => setAddDevice(!addDevice)}>
                    <div className="w-sm h-[600px] bg-white rounded-2xl p-4">
                        {deviceListOfThings && (
                            <div className="w-full">
                                <table className="w-full">
                                    <thead className="bg-slate-500 py-2 text-white w-full">
                                        <tr>
                                            <th className="text-start px-6 text-md font-semibold">
                                                Name
                                            </th>
                                            <th className="text-start px-6 text-md font-semibold">
                                                Status
                                            </th>
                                            <th className="text-start px-6 text-md font-semibold">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="h-full bg-gray-100/80 divide-slate-300 divide-y">
                                        {deviceListOfThings.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6">{item.name}</td>
                                                <td className="px-6">{item.status}</td>
                                                <td className="px-6">
                                                    <button
                                                        className="btn-seconds px-2 my-2"
                                                        onClick={async () => {
                                                            try {
                                                                await addDeviceIntoPage(url.id, item.idDevice, auth.currentUser.uid);
                                                            } catch (error) {
                                                                console.error('Error adding device:', error);
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
                        )}
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

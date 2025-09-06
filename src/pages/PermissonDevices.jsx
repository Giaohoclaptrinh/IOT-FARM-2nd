import {
    getDeviceListByuser,
    getDevices,
    getUser,
    toggleDevice,
} from "@/components/Database/Services";
import { auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import HomeWrap from "./HomeWrap";
import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { TiUserDeleteOutline } from "react-icons/ti";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import SearchUser from "@/components/TopBar and Search/SearchUser";

const PermissonDevices = () => {
    const [userData, setUserData] = useState({});
    const [devices, setDevices] = useState([]);
    const [addDeviceIntoUser, setaddDeviceIntoUser] = useState(false);
    const [sendDevice, setSendDevice] = useState({});
    const notificationStatus = new Nt_alert().build();
    useEffect(() => {
        const User = async () => {
            setUserData(await getUser());
        };
        User();
    }, []);

    useEffect(() => {
        const _setDevice = async () => {
            if (!userData || !userData.uid) return;
            if (userData.role === "admin") {
                setDevices(await getDevices());
            } else {
                setDevices((await getDeviceListByuser(userData.uid)) || []);
            }
        };
        _setDevice();
    }, [userData.uid]);
    return (
        <HomeWrap>
            <div>
                <table
                    className="border-collapse  border  border-gray-300 table-auto 
                    w-full max-w-full"
                >
                    <thead className="">
                        <tr className="bg-blue-200">
                            <th className="text-center text-xl font-semibold  text-gray-700 py-4">
                                Device
                            </th>
                            <th className="text-center text-xl font-semibold  text-gray-700  py-4">
                                Status
                            </th>
                            <th className="text-center text-xl font-semibold  text-gray-700 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-gray-500 ">
                        {devices.map((item, index) => {
                            return (
                                <tr
                                    key={index}
                                    className=" bg-white  border-b
                                     border-gray-400 
                                     "
                                >
                                    <td className=" text-center  p-4 ">
                                        <span
                                            className=" block p-px bg-sky-400 shadow text-white
                                             rounded-lg"
                                        >
                                            {item.name}
                                        </span>
                                    </td>
                                    <td className=" text-center px-8 border-box ">
                                        <span
                                            className={`
                                                    inline-block  py-px px-2   ${
                                                        item.status.toLowerCase() ===
                                                        "online"
                                                            ? "bg-green-400"
                                                            : "bg-red-400"
                                                    }   shadow text-white
                                             rounded-lg
                                             `}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className=" text-center  w-4/6">
                                        <div className="flex-center gap-x-2">
                                            <Link
                                                to={{
                                                    pathname: `/controlsdevices/${item.idDevice}`,
                                                }}
                                                className="bg-gray-100 rounded-md hover:bg-gray-200 size-8 flex-center"
                                            >
                                                <GrFormView className="text-xl " />
                                            </Link>
                                            {userData.role === "admin" && (
                                                <Link className="bg-gray-100 rounded-md hover:bg-gray-200 size-8 flex-center">
                                                    <CiEdit
                                                        className="text-xl "
                                                        onClick={async (e) => {
                                                            const status =
                                                                await toggleDevice(
                                                                    item.idDevice
                                                                );
                                                            notificationStatus.createNode(
                                                                status
                                                            );
                                                            setDevices(
                                                                await getDevices()
                                                            );
                                                        }}
                                                    />
                                                </Link>
                                            )}
                                            {userData.role === "admin" && (
                                                <button
                                                    className="bg-gray-100 cursor-pointer rounded-md
                                                   hover:bg-gray-200 size-8 flex-center"
                                                    onClick={async (e) => {
                                                        setaddDeviceIntoUser(
                                                            !addDeviceIntoUser
                                                        );
                                                        setSendDevice(item);
                                                    }}
                                                >
                                                    <TiUserDeleteOutline className="text-xl " />
                                                    {addDeviceIntoUser && (
                                                        <SearchUser
                                                            deviceId={
                                                                sendDevice.idDevice
                                                            }
                                                            deviceName={
                                                                sendDevice.name
                                                            }
                                                            onClose={() => {
                                                                setaddDeviceIntoUser(
                                                                    !addDeviceIntoUser
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </button>
                                            )}
                                        </div>
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

export default PermissonDevices;

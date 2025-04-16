import {
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

const PermissonDevices = () => {
    const [userData, setUserData] = useState({});
    const [devices, setDevices] = useState([]);
    useEffect(() => {
        const User = async () => {
            setUserData(await getUser());
            setDevices(await getDevices());
        };
        User();
    }, []);
    console.log(devices);
    return (
        userData.role === "admin" && (
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
                                                <Link className="bg-gray-100 rounded-md hover:bg-gray-200 size-8 flex-center">
                                                    <CiEdit
                                                        className="text-xl "
                                                        onClick={async (e) => {
                                                            await toggleDevice(
                                                                item.idDevice
                                                            );
                                                            setDevices(
                                                                await getDevices()
                                                            );
                                                        }}
                                                    />
                                                </Link>
                                                <Link className="bg-gray-100 rounded-md hover:bg-gray-200 size-8 flex-center">
                                                    <TiUserDeleteOutline className="text-xl " />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </HomeWrap>
        )
    );
};

export default PermissonDevices;

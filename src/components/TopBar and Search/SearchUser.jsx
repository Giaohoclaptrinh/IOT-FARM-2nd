import React, { useState, useCallback } from "react";
import OverLay from "../Utilities/OverLay";
import { IoSearch } from "react-icons/io5";
import {
    allowDeviceOfUser,
    allowDeviceofUsers,
    searchUserByName,
} from "../Database/Services";
import { IoAddCircle } from "react-icons/io5";

const SearchUser = ({ deviceId, deviceName, onClose }) => {
    const [nameInput, setNameInput] = useState("");
    const [userList, setUserList] = useState([]);
    const [checkUSers, setCheckUser] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const notification = new Nt_alert().build();

    const handleCheck = (userID) => {
        setCheckUser((prev) => {
            return prev.includes(userID)
                ? prev.filter((item) => item !== userID)
                : [...prev, userID];
        });
    };

    const handleCheckAll = () => {
        if (!checkAll && userList) {
            setCheckUser(userList.map((item) => item.uid));
            setCheckAll(true);
        } else {
            setCheckUser([]);
            setCheckAll(false);
        }
    };


    const onChangle = useCallback(async (name) => {
        if (name.trim() === "") return;
        const users = await searchUserByName(name);
        setUserList(users);
    }, []);

    const handleAddDevices = async () => {
        const notificationItem = await allowDeviceofUsers(checkUSers, deviceId);
        console.log(notification);

        notification.createNode(notificationItem);

    };

    const handleKeyDown = (e) => {
        // Ngăn chặn sự kiện mặc định khi nhấn phím Space hoặc Enter
        if (e.key === "Enter") {
            e.preventDefault(); // Ngăn hành động mặc định
        }
    };

    return (
        <OverLay onClose={onClose}>
            <div className="w-lg h-[700px] p-6 bg-white rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {deviceName.toUpperCase()}
                    </h3>
                    <button
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
                        onClick={handleAddDevices}
                    >
                        <IoAddCircle className="text-4xl" />
                    </button>
                </div>

                <form
                    action=""
                    onSubmit={(e) => {
                        e.preventDefault(); // Ngăn submit form
                    }}
                    className="w-full"
                >
                    <div className="relative w-full h-16 rounded-full shadow-lg bg-gray-100 border border-gray-300">
                        <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <IoSearch className="text-3xl" />
                        </span>
                        <input
                            type="text"
                            value={nameInput}

                            onChange={(e) => {
                                setNameInput(e.target.value);
                                onChangle(e.target.value);

                            }}
                            onKeyDown={handleKeyDown}
                            className="w-full h-full pl-16 pr-6 text-lg text-gray-700 placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            placeholder="Search for a user..."
                        />
                    </div>

                    {userList.length > 0 && (
                        <div className="mt-6 border-t border-gray-200">
                            <table className="w-full table-auto">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">
                                            <input

                                                type="checkbox"
                                                className="accent-gray-600"
                                                checked={checkAll}
                                                onChange={handleCheckAll}
                                            />
                                            <span className="ml-2 text-gray-600 font-medium">
                                                Name
                                            </span>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <td className="px-4 py-2 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="accent-gray-600"
                                                    checked={checkUSers.includes(
                                                        item.uid
                                                    )}
                                                    onChange={() =>
                                                        handleCheck(item.uid)
                                                    }
                                                />
                                                <span className="text-gray-700 ml-2">
                                                    {item.name}
                                                </span>
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </form>
            </div>
        </OverLay>
    );
};

export default SearchUser;

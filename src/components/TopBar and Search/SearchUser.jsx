import React, { useState } from "react";
import OverLay from "../Utilities/OverLay";
import { IoSearch } from "react-icons/io5";
import { allowDeviceOfUser, allowDeviceofUsers, searchUserByName } from "../Database/Services";
import { IoAddCircle } from "react-icons/io5";

const SearchUser = ({ deviceId, deviceName, onClose }) => {
    const [nameInput, setNameInput] = useState("");
    const [userList, setUserList] = useState([]);
    const [checkUSers, setCheckUser] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    const handleCheck = (userID) => {
        setCheckUser((prev) => {
            return prev.includes(userID)
                ? prev.filter((item) => {
                      return item !== userID;
                  })
                : [...prev, userID];
        });
    };
    const handleCheckAll = () => {
        if (!checkAll && userList) {
            setCheckUser(
                userList.map((item) => {
                    return item.uid;
                })
            );
            setCheckAll(true);
        } else {
            setCheckUser([]);
            setCheckAll(false);
        }
    };
    const onChangle = async (name) => {
        setUserList(await searchUserByName(name));
    };
    console.log("list :", checkUSers);
    return (
        <OverLay onClose={onClose}>
            <div className="w-lg h-[700px] p-4">
                <div className="flex-center">
                    <div
                        className="flex w-[90%] relative
                          items-center rounded-full bg-blue-200 h-16 px-4 font-semibold 
                     text-gray-700
                      text-xl"
                    >
                        <span>{deviceName.toUpperCase()}</span>
                        <button
                            className="h-full w-16
                            hover:bg-blue-600 transition-colors duran rounded-full absolute right-0
                             bg-blue-400 flex-center"
                            onClick={async (e) => {
                                await allowDeviceofUsers(checkUSers,deviceId);
                            }}
                        >
                            <IoAddCircle className="text-5xl text-white" />
                        </button>
                    </div>
                </div>
                <form
                    action=""
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="w-full mt-4"
                >
                    <div
                        className="w-full relative h-16 rounded-full flex inset-shadow-2xs 
                            border focus-within:border-blue-400
                            shadow-xs   "
                    >
                        <span className="relative   inline-block h-full w-20 rounded-md ">
                            <IoSearch
                                className="absolute animate-pulse  text-4xl top-1/2 left-4 text-slate-600 
                                 -translate-y-1/2"
                            />
                        </span>
                        <input
                            type="text"
                            value={nameInput}
                            onChange={async (e) => {
                                const name = e.target.value;
                                setNameInput(name);
                                await onChangle(nameInput);
                            }}
                            className="px-4  size-full text-2xl pr-16 rounded-lg text-slate-600 placeholder:tracking-widest"
                            placeholder="User to Search..."
                        />
                    </div>
                    {userList.length !== 0 && (
                        <div className="size-full  mt-2 border ">
                            <table className="table-auto size-full ">
                                <thead className="">
                                    <tr className="bg-green-50 ">
                                        <th className="text-left flex items-center ">
                                            <input
                                                oncheck
                                                type="checkbox"
                                                name=""
                                                id="all"
                                                className="accent-gray-600 mx-2"
                                                onChange={(e) => {
                                                    handleCheckAll();
                                                }}
                                            />
                                            <span>name</span>
                                        </th>
                                        <th className=""></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList.map((item, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="text-left flex items-center"
                                            >
                                                <td className="text-left">
                                                    <input
                                                        type="checkbox"
                                                        name=""
                                                        className="mx-2 accent-gray-400"
                                                        id=""
                                                        checked={checkUSers.includes(
                                                            item.uid
                                                        )}
                                                        onChange={(e) => {
                                                            handleCheck(
                                                                item.uid
                                                            );
                                                        }}
                                                    />
                                                    <span>{item.name}</span>
                                                </td>
                                                <td></td>
                                            </tr>
                                        );
                                    })}
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

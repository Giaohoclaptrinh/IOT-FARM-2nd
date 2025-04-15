import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import React, { createElement, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/db.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaCaretDown } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi2";
import { AiFillDatabase } from "react-icons/ai";
import { TfiWallet } from "react-icons/tfi";
import { BiNotification } from "react-icons/bi";
import { GoRepoTemplate } from "react-icons/go";
import { GrResources } from "react-icons/gr";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaHornbill } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { LuUserRoundCog } from "react-icons/lu";
import { context } from "@/utils/Provide";

const Sidebar = () => {
    const urlList = [
        {
            title: "Home",
            href: "/",
            icon: HiOutlineHome,
        },
        {
            title: "Sketches",
            href: "/sketches",
            icon: AiFillDatabase,
            marker: true,
        },
        {
            title: "Devices",
            href: "/devices",
            icon: TfiWallet,
        },
        {
            title: "Things",
            href: "/things",
            icon: BiNotification,
        },
        {
            title: "User",
            href: "/user",
            icon: LuUserRoundCog,
            marker: true,
        },
        {
            title: "Resource",
            href: "/resource",
            icon: GrResources,
        },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/sign-in");
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const [userDown, setUserDown] = useState(false);
    const [userCurrent, setUserCurrent] = useState({
        userName: "",
        email: "",
    });
    const navigate = useNavigate();

    const menuList = [
        {
            title: "Settings",
            href: "/profile-settings",
            icon: RiUserSettingsLine,
        },
        { title: "Billing", href: "/", icon: FaHornbill },
        { title: "SignOut", href: "/signOut", icon: VscSignOut },
    ];

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserCurrent({
                    userName: user.displayName,
                    email: user.email,
                });
                console.log(userCurrent);
            } else {
                console.log("User not logged in");
            }
        });
    }, []);

    const handleToggleSubMenu = (index) => {
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    };

    return auth.currentUser ? (
        <aside className="fixed min-h-screen font-seconds font-light min-w-60 max-w-60 overflow-auto text-gray-700 border-r border-gray-300 top-0 left-0 bg-[#ffffff]">
            <div className="px-2 relative">
                <div
                    className={`flex mt-4 p-2 relative hover:bg-blue-100 hover:rounded-lg cursor-pointer
                    ${userDown && "bg-blue-100 rounded-lg"}`}
                    onClick={() => setUserDown(!userDown)}
                >
                    <span className="inline-flex rounded-full items-center justify-center w-12 h-12 bg-blue-400 text-white font-primary">
                        {userCurrent.userName.split("").slice(0, 2)}
                    </span>
                    <div className="ml-4  text-xs">
                        <b className="block max-w-36 text-nowrap overflow-hidden text-ellipsis text-md font-semibold">
                            {userCurrent.userName}{" "}
                        </b>
                        <span className="block max-w-36 overflow-hidden text-[15px] text-gray-500 text-ellipsis whitespace-nowrap">
                            {userCurrent.email}
                        </span>
                    </div>
                    <div className="ml-auto mr-4 flex items-center">
                        <FaCaretDown />
                    </div>
                </div>
                <div
                    className={`w-56 absolute top-[75px] left-2 z-10 shadow-lg bg-white transition-all duration-300 ease-out overflow-hidden
                    ${
                        userDown
                            ? "h-[129px] opacity-100 flex flex-col jusitfy-end  "
                            : "h-0 opacity-0 pointer-events-none"
                    }`}
                >
                    {menuList.map((item) => {
                        return item.title === "SignOut" ? (
                            <Link
                                onClick={handleLogout}
                                key={item.title}
                                className="flex items-center space-y-2 border-b
                                 px-2 py-2 hover:bg-gray-300 hover:bg-bgMain pr-14
                                 "
                                to={item.href}
                            >
                                <div className="mr-2 text-lg">
                                    {item.icon &&
                                        React.createElement(item.icon)}
                                </div>
                                <div className="ml-4">{item.title}</div>
                            </Link>
                        ) : (
                            <Link
                                key={item.title}
                                className="flex items-center space-y-2 border-b px-2 py-2 hover:bg-gray-300 hover:bg-bgMain pr-14"
                                to={item.href}
                            >
                                <div className="mr-2 text-lg">
                                    {item.icon &&
                                        React.createElement(item.icon)}
                                </div>
                                <div className="ml-4">{item.title}</div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {urlList.map((item) => (
                <div className="px-2" key={item.href}>
                    <Link
                        to={item.href}
                        className={`flex min-w-full items-center mt-4 p-2 relative
                            hover:bg-blue-100 hover:rounded-lg cursor-pointer
${item.marker && "border border-l-0 border-r-0 hover:rounded-none"}`}
                    >
                        <div className="mr-2">
                            {item.icon && React.createElement(item.icon)}
                        </div>
                        <div>{item.title}</div>
                    </Link>
                </div>
            ))}
        </aside>
    ) : (
        ""
    );
};

export default Sidebar;

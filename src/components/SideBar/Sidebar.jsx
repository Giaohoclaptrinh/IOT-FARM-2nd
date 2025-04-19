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
import { AiFillCaretDown } from "react-icons/ai";
import { getUser } from "../Database/Services";

const Sidebar = () => {
    const [admin, setAdmin] = useState({});
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
            icon: TfiWallet,
            submenu: [
                { title: "Device  Management", href: "devices" },
                { title: "Device  View", href: "/PermissonDevices" },
            ],
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
    const [showIndex, setShowIndex] = useState(-1);
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
            } else {
                console.log("User not logged in");
            }
        });
    }, []);
    useEffect(() => {
        let unsubscribe;

        const checkAuth = async () => {
            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const admin = await getUser();
                    setAdmin(admin);
                }
            });
        };

        checkAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
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
                    <span className="inline-flex  rounded-full items-center justify-center w-12 h-12 bg-blue-400 text-white font-primary">
                        {userCurrent.userName.split("").slice(0, 2)}
                    </span>
                    <div className="ml-4  text-xs">
                        <b className="block max-w-36 text-nowrap overflow-hidden text-ellipsis text-md font-semibold">
                            {userCurrent.userName}{" "}
                        </b>
                        <span className="block max-w-28 overflow-hidden text-[15px] text-gray-500 text-ellipsis whitespace-nowrap">
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
            {urlList.map((item, index) => (
                <div className="px-2" key={index}>
                    {item.href ? (
                        <Link
                            to={item.href}
                            className={`flex flex-wrap min-w-full items-center mt-4 p-2 relative
                            hover:bg-blue-100 hover:rounded-lg cursor-pointer
                            ${
                                item.marker &&
                                "border border-l-0 border-r-0 hover:rounded-none"
                            }`}
                        >
                            {/* <div className="mr-2">
                            {item.icon && React.createElement(item.icon)}
                        </div> */}
                            <div
                                className={`flex-center justify-start ${
                                    item.submenu ? "mb-2" : ""
                                } w-full`}
                            >
                                <div className="mr-2">
                                    {item.icon &&
                                        React.createElement(item.icon)}
                                </div>
                                {item.title}{" "}
                                {item.submenu && (
                                    <AiFillCaretDown className="ml-auto" />
                                )}
                            </div>
                            {item.submenu && (
                                <div
                                    className="flex-center max-h-32 items-start 
                            gap-y-px flex-col w-full bg-white overflow-y-auto rounded-md"
                                >
                                    {item.submenu.map(
                                        (itemChild, indexChild) => {
                                            return (
                                                <Link
                                                    key={indexChild}
                                                    className="block w-full rounded-xs px-2 py-2 hover:bg-amber-200 bg-white "
                                                    to={{
                                                        pathname: `${itemChild.href}`,
                                                    }}
                                                >
                                                    {itemChild.title}
                                                </Link>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </Link>
                    ) : (
                        <div
                            onClick={(e) => {
                                if (showIndex === index) {
                                    setShowIndex(-1);
                                } else {
                                    setShowIndex(index);
                                }
                            }}
                            to={item.href}
                            className={`flex flex-wrap min-w-full items-center mt-4 p-2 hover:bg-blue-100 hover:rounded-md relative
                             cursor-pointer
                            ${
                                showIndex === index
                                    ? "bg-blue-100 rounded-md"
                                    : ""
                            }
                            ${
                                item.marker &&
                                "border border-l-0 border-r-0 hover:rounded-none"
                            }`}
                        >
                            {/* <div className="mr-2">
                            {item.icon && React.createElement(item.icon)}
                        </div> */}
                            <div
                                className={`flex-center justify-start ${
                                    item.submenu ? "mb-2" : ""
                                } w-full`}
                            >
                                <div className="mr-2">
                                    {item.icon &&
                                        React.createElement(item.icon)}
                                </div>
                                {item.title}{" "}
                                {item.submenu && (
                                    <AiFillCaretDown className="ml-auto text-xs" />
                                )}
                            </div>
                            {item.submenu && showIndex === index && (
                                <div
                                    className="flex-center max-h-32 items-start 
                            gap-y-px flex-col w-full bg-white overflow-y-auto rounded-md"
                                >
                                    {item.submenu.map(
                                        (itemChild, indexChild) => {
                                            if (admin.role === "admin") {
                                                return (
                                                    <Link
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        key={indexChild}
                                                        className="block w-full  px-2 py-2 hover:bg-gray-200
                                                        border-b border-gray-400 last:border-none
                                                         bg-white "
                                                        to={{
                                                            pathname: `${itemChild.href}`,
                                                        }}
                                                    >
                                                        {itemChild.title}
                                                    </Link>
                                                );
                                            } else if (
                                                admin.role !== "admin" &&
                                                itemChild.title.toLowerCase() !==
                                                    "Device  Management".toLowerCase()
                                            ) {
                                                return (
                                                    <Link
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        key={indexChild}
                                                        className="block w-full  px-2 py-2 hover:bg-gray-200
                                                        border-b border-gray-400 last:border-none
                                                         bg-white "
                                                        to={{
                                                            pathname: `${itemChild.href}`,
                                                        }}
                                                    >
                                                        {itemChild.title}
                                                    </Link>
                                                );
                                            }
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </aside>
    ) : (
        ""
    );
};

export default Sidebar;

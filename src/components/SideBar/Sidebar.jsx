import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { HiOutlineHome } from "react-icons/hi";
import { AiFillDatabase, AiFillCaretDown } from "react-icons/ai";
import { TfiWallet } from "react-icons/tfi";
import { BiNotification } from "react-icons/bi";
import { GrResources } from "react-icons/gr";
import { LuUserRoundCog } from "react-icons/lu";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaHornbill } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { FaCaretDown } from "react-icons/fa";
import { auth } from "@/firebase/db.config";
import { getUser } from "../Database/Services";

const urlList = [
  { title: "Home", href: "/", icon: HiOutlineHome },
  { title: "Sketches", href: "/sketches", icon: AiFillDatabase, marker: true },
  {
    title: "Devices",
    icon: TfiWallet,
    submenu: [
      { title: "Device  Management", href: "devices" },
      { title: "Device  View", href: "/devicesList" },
    ],
  },
  { title: "Things", href: "/things", icon: BiNotification },
  { title: "User", href: "/user", icon: LuUserRoundCog, marker: true },
  { title: "Resource", href: "/resource", icon: GrResources },
];

const menuList = [
  { title: "Settings", href: "/profile-settings", icon: RiUserSettingsLine },
  { title: "Billing", href: "/", icon: FaHornbill },
  { title: "SignOut", href: "/signOut", icon: VscSignOut },
];

const Sidebar = () => {
  const [admin, setAdmin] = useState({});
  const [showIndex, setShowIndex] = useState(-1);
  const [userDown, setUserDown] = useState(false);
  const [userCurrent, setUserCurrent] = useState({ userName: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserCurrent({
          userName: user.displayName || "User",
          email: user.email || "",
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe;
    const checkAuth = async () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const adminData = await getUser();
          setAdmin(adminData);
        }
      });
    };
    checkAuth();
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  if (!auth.currentUser) return null;

  return (
    <aside className="fixed min-h-screen font-light min-w-60 max-w-60 overflow-auto text-gray-700 border-r border-gray-200 top-0 left-0 bg-white">
      {/* User Info */}
      <div className="px-2 relative">
        <div
          className={`flex mt-4 p-2 items-center hover:bg-blue-100 rounded-lg cursor-pointer transition
            ${userDown ? "bg-blue-100" : ""}`}
          onClick={() => setUserDown((prev) => !prev)}
        >
          <span className="inline-flex rounded-full items-center justify-center w-12 h-12 bg-blue-400 text-white font-semibold text-lg">
            {userCurrent.userName?.slice(0, 2).toUpperCase()}
          </span>
          <div className="ml-4 text-xs">
            <b className="block max-w-36 truncate text-md font-semibold">
              {userCurrent.userName}
            </b>
            <span className="block max-w-28 truncate text-gray-500 text-[15px]">
              {userCurrent.email}
            </span>
          </div>
          <div className="ml-auto mr-4 flex items-center">
            <FaCaretDown />
          </div>
        </div>
        {/* User Dropdown */}
        <div
          className={`w-56 absolute top-[75px] left-2 z-10 shadow-lg bg-white transition-all duration-300 overflow-hidden
            ${userDown ? "h-[129px] opacity-100 flex flex-col" : "h-0 opacity-0 pointer-events-none"}`}
        >
          {menuList.map((item) =>
            item.title === "SignOut" ? (
              <button
                key={item.title}
                onClick={handleLogout}
                className="flex items-center border-b px-2 py-2 hover:bg-gray-200 pr-14 w-full text-left"
              >
                <span className="mr-2 text-lg">{item.icon && React.createElement(item.icon)}</span>
                <span className="ml-4">{item.title}</span>
              </button>
            ) : (
              <Link
                key={item.title}
                className="flex items-center border-b px-2 py-2 hover:bg-gray-200 pr-14"
                to={item.href}
              >
                <span className="mr-2 text-lg">{item.icon && React.createElement(item.icon)}</span>
                <span className="ml-4">{item.title}</span>
              </Link>
            )
          )}
        </div>
      </div>
      {/* Main Menu */}
      {urlList.map((item, idx) => (
        <div className="px-2" key={idx}>
          {item.href ? (
            <Link
              to={item.href}
              className={`flex items-center mt-4 p-2 hover:bg-blue-100 rounded-lg cursor-pointer transition
                ${item.marker ? "border border-l-0 border-r-0" : ""}`}
            >
              <span className="mr-2">{item.icon && React.createElement(item.icon)}</span>
              <span>{item.title}</span>
              {item.submenu && <AiFillCaretDown className="ml-auto" />}
            </Link>
          ) : (
            <div
              onClick={() => setShowIndex(showIndex === idx ? -1 : idx)}
              className={`flex items-center mt-4 p-2 hover:bg-blue-100 rounded-lg cursor-pointer transition
                ${showIndex === idx ? "bg-blue-100" : ""}
                ${item.marker ? "border border-l-0 border-r-0" : ""}`}
            >
              <span className="mr-2">{item.icon && React.createElement(item.icon)}</span>
              <span>{item.title}</span>
              {item.submenu && <AiFillCaretDown className="ml-auto text-xs" />}
            </div>
          )}
          {/* Submenu */}
          {item.submenu && (item.href ? true : showIndex === idx) && (
            <div className="flex flex-col w-full bg-white rounded-md shadow-sm ml-6 mt-1">
              {item.submenu.map((sub, subIdx) => {
                // Quyền admin
                if (admin.role === "admin" || sub.title.toLowerCase() !== "device  management") {
                  return (
                    <Link
                      key={subIdx}
                      className="block w-full px-3 py-2 hover:bg-amber-100 text-gray-700 rounded transition"
                      to={sub.href}
                      onClick={e => e.stopPropagation()}
                    >
                      {sub.title}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;

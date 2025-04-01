import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useState } from "react";

const Sidebar = () => {
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const navigate = useNavigate();

    const menuList = [
        { title: "Dashboard", href: "/dashboards" },
        { title: "Devices", href: "/devices" },
        { title: "User", href: "/user" },
        {
            title: "Settings",
            subMenu: [
                { title: "Profile Settings", href: "/profile-settings" },
                { title: "Account Security", href: "/account-security" }
            ]
        }

        // { title: "Dashboard", href: "/dashboards" },
        // { title: "Device", href: "/devices" },
        // { 
        //     title: "Admin", 
        //     subMenu: ["Option 1", "Option 2", "Option 3"] 
        // },
        // { title: "Inbox", href: "/inbox" },
        // { title: "User", href: "/user" },
        // { title: "Product", href: "/product" },
        // {   
        //     title: "Login",
        //     subMenu: [
        //         { title: "Sign In", href: "/sign-in" }, 
        //         { title: "Sign Up", href: "/sign-up" }
        //     ]
        // }
    ];

    const handleToggleSubMenu = (index) => {
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    };

    return (
        <aside className="w-64 h-full min-h-screen bg-gray-900 text-white overflow-auto p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4"></h2>
            <ul className="flex-grow">
                {menuList.map((menu, index) => (
                    <li 
                        key={index} 
                        className="relative flex flex-col cursor-pointer hover:bg-gray-700 justify-start gap-x-4 items-start w-full py-2 rounded-xl px-2 text-lg font-semibold"
                    >
                        {menu.href ? (
                            <Link to={menu.href} className="flex gap-x-4 items-center w-full">
                                <MdSpaceDashboard />
                                {menu.title}
                            </Link>
                        ) : (
                            <div className="flex gap-x-4 items-center w-full" onClick={() => handleToggleSubMenu(index)}>
                                <MdSpaceDashboard />
                                {menu.title}
                            </div>
                        )}

                        {menu.subMenu && openSubMenuIndex === index && (
                            <ul className="w-full pl-4">
                                {menu.subMenu.map((subItem, subIndex) => (
                                    <li key={subIndex} className="text-gray-300 cursor-pointer hover:bg-gray-600 py-2 rounded-lg px-2 hover:text-white">
                                        <Link className="w-full h-full block" to={subItem.href}>{subItem.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {menu.subMenu && (
                            <button 
                                onClick={() => handleToggleSubMenu(index)} 
                                className={`absolute top-4 right-4 transition-transform ${openSubMenuIndex === index ? "" : "rotate-180"}`}
                            >
                                <IoArrowUpCircleOutline />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;

import { MdSpaceDashboard } from "react-icons/md";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { useState } from "react";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";





const SideBar = () => {
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

    const menuList = [ 
        { title: "Dashboard" },
        { title: "Kaban" },
        { 
            title: "Menu", 
            subMenu: ["Option 1", "Option 2", "Option 3"] 
        },
        { title: "Inbox" },
        { title: "User" },
        { title: "Product" },
        {   
            title: "Login",
            subMenu: ["Sign In", "Sign Up"]
        }
    ];

    // Hàm toggle submenu dựa vào index
    const handleToggleSubMenu = (index) => {
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    };

    return (
        <aside className="w-72 h-screen relative bg-gray-700 text-white box-border border-r-[1px] border-white p-4">
            
            <ul>
                {menuList.map((menu, index) => (
                    <li 
                        key={index} 
                        className="relative flex-wrap flex cursor-pointer hover:bg-gray-600 justify-start gap-x-4 items-center w-full py-2 rounded-xl px-2 mt-2 text-lg font-semibold font-mono"
                    >
                        <MdSpaceDashboard />
                        {menu.title}    

                        {/* Kiểm tra nếu có submenu */}
                        {menu.subMenu && openSubMenuIndex === index && (
                            <ul className="w-full block pl-4">
                                {menu.subMenu.map((subItem, subIndex) => (
                                    <li 
                                        key={subIndex} 
                                        className="text-gray-300 cursor-pointer hover:bg-sky-50 py-2 rounded-lg box-border px-2 hover:text-gray-700"
                                    >
                                        {subItem}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Nút mở submenu */}
                        {menu.subMenu && (
                            <button 
                                onClick={() => handleToggleSubMenu(index)} 
                                className="absolute top-4 rotate-180 scale-120  active:opacity-60 w-4 h-4 cursor-pointer right-4"
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

export default SideBar;

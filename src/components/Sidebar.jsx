import { Link } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useState } from "react";

const SideBar = () => {
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

    const menuList = [ 
      { title: "Dashboard", href: "/dashboards" },
      { title: "Device", href: "/devices" },
      { 
          title: "Admin", 
          subMenu: ["Option 1", "Option 2", "Option 3"] 
      },
      { title: "Inbox", href: "/inbox" },
      { title: "User", href: "/user" },
      { title: "Product", href: "/product" },
      {   
          title: "Login",
          subMenu: [
              { title: "Sign In", href: "/sign-in" }, 
              { title: "Sign Up", href: "/sign-up" }
          ]
      }
  ];
  

    const handleToggleSubMenu = (index) => {
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    };

    return (
        <aside className="w-72 h-screen bg-gray-700 text-white border-r border-white p-4">
            <ul>
                {menuList.map((menu, index) => (
                    <li 
                        key={index} 
                        className="relative flex flex-col cursor-pointer hover:bg-gray-600 justify-start gap-x-4 items-start w-full py-2 rounded-xl px-2 mt-2 text-lg font-semibold font-mono"
                    >
                        {/* Nếu có href, sử dụng Link */}
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

                        {/* Kiểm tra nếu có submenu */}
                        {menu.subMenu && openSubMenuIndex === index && (
                            <ul className="w-full pl-4">
                                {menu.subMenu.map((subItem, subIndex) => (
                                    <li key={subIndex} className="text-gray-300 cursor-pointer hover:bg-sky-50 py-2 rounded-lg px-2 hover:text-gray-700">
                                        {/* Nếu submenu có href, dùng Link */}
                                        {typeof subItem === "object" && subItem.href ? (
                                            <Link className="w-full h-full block" to={subItem.href}>{subItem.title}</Link>
                                        ) : (
                                            subItem
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Nút mở submenu */}
                        {menu.subMenu && (
                            <button 
                                onClick={() => handleToggleSubMenu(index)} 
                                className={`absolute top-4 right-4 transition-transform ${openSubMenuIndex === index ? "rotate-180" : ""}`}
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

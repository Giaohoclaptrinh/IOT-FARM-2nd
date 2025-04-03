import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { auth } from "@/firebase/db.config";

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

      
    ];

    const handleToggleSubMenu = (index) => {
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    };
    console.log(auth.currentUser)
    return (
        <aside className="min-h-screen px-32">
            <div>
               
            </div>
        </aside>
    );
};

export default Sidebar;

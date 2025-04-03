import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";


const Sidebar = () => {
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const [userCurrent,setUserCurrent] = useState({
        userName:"",
        email:""
    })
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
    useEffect(()=>{ 
        onAuthStateChanged(auth,async(user)=>{
            const Unsubscribe = ()=>{
                if (user) {
                   setUserCurrent((prev)=>{
                    return  {
                        ...prev,
                        userName:user.displayName,
                        email:user.email,
                    }
                   })
                   console.log(userCurrent)
                } else {
                    console.log("User not logged in");
                }}
                Unsubscribe()})

    },[])

    const handleToggleSubMenu = (index) => {
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
    };
  
    return (
        <aside className="fixed min-h-screen min-w-56  top-0  left-0 bg-white">
            <div>
                <div>
                   <span className="inline-flex  items-center justify-center 
                   p-4 bg-blue-200  font-primary" > {userCurrent.userName.split("").slice(0,2)}</span>
                </div>
               
            </div>
        </aside>
    );
};

export default Sidebar;

import { auth } from "@/firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeWrap({ children }) {
    const [userCurrent, setUserCurrent] = useState({
        userName: "",
        email: "",
    });

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserCurrent({
                    userName: user.displayName,
                    email: user.email,
                });
                //    console.log(userCurrent.email);
            } else {
                console.log("User not logged in");
            }
        });
    }, []);
    return (
        <div
            className={`fixed ${
                userCurrent
                    ? "min-w-widthcontainer   "
                    : "min-w-widthcontainer  "
            } h-full  max-w-widthcontainer mt-[70px] overflow-scroll p-2 min-h-16   border-b border-gray-300 top-0 right-0  bg-white`}
        >
            {children}
        </div>
    );
}

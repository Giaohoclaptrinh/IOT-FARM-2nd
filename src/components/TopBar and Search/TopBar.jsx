import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "@/firebase/db.config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FaRegUser, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { AiFillOpenAI } from "react-icons/ai";
import { TfiWallet } from "react-icons/tfi";
import { BiNotification } from "react-icons/bi";
import { context } from "@/utils/Provide";
import { HiOutlineXMark } from "react-icons/hi2";
import OverLay from "../Utilities/OverLay";

const TopBar = ({ onSearch }) => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("Người dùng");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isShowDevices, setIsShowDevices] = useState(false);
    const { state, dispatch } = useContext(context);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(true);
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    setUserName(
                        userDocSnap.exists()
                            ? userDocSnap.data().name || "Người dùng"
                            : "Người dùng"
                    );
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Xác định loại tìm kiếm dựa trên trang hiện tại
    const placeholderText = location.pathname.includes("device")
        ? "Tìm kiếm thiết bị..."
        : "Tìm kiếm người dùng...";

    useEffect(() => {
        const fetchData = async () => {
            if (!searchTerm) {
                setSearchResults([]);
                return;
            }

            try {
                let querySnapshot;
                if (location.pathname.includes("device")) {
                    querySnapshot = await getDocs(collection(db, "devices"));
                } else {
                    querySnapshot = await getDocs(collection(db, "users"));
                }

                const results = querySnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((item) =>
                        location.pathname.includes("device")
                            ? item.name
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                            : item.email
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                              item.name
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                    );

                setSearchResults(results);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            }
        };

        fetchData();
    }, [searchTerm, location.pathname]);

    const handleSelectSearchResult = (result) => {
        setSearchTerm(
            location.pathname.includes("device") ? result.name : result.email
        );
        setIsFocused(false);
        navigate(
            location.pathname.includes("device")
                ? `/device/${result.id}`
                : `/user/${result.id}`
        );
    };

    return (
        <div
            className={
                `fixed ${
                    user ? "min-w-widthcontainer" : "min-w-full"
                } p-2 min-h-16  font-primary  border-b border-gray-300 top-0 right-0  bg-white` //fixed ${user ?('min-w-top-bar'):('min-w-full')} bị lỗi
                //  "fixed w-full p-2 min-h-16 z-50 font-primary border-b border-gray-300 top-0 right-0 bg-white"
            }
        >
            <div>
                <div className="flex items-center">
                    <div className="inline-flex  text-blue-500 text-3xl gap-x-2 items-center">
                        <AiFillOpenAI className="text-5xl text-blue-500" />
                        <b>HTR</b>
                    </div>

                    {/* <div className="relative w-64 flex items-center bg-white rounded-lg px-3 py-2 ml-6">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholderText}
            className="w-full bg-white outline-none text-gray-600 border-none "
          />
          {isFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectSearchResult(result)}
                >
                  {location.pathname.includes("device") ? result.name : result.name}
                </div>
              ))}
            </div>
          )}
        </div> */}

                    {user ? (
                        <div className="flex  gap-x-4 ml-auto">
                            <div
                                className="flex flex-row-reverse  min-w-24 px-4 py-px cursor-pointer bg-bgMain  hover:bg-slate-300 rounded-lg gap-x-4 items-center"
                                onClick={(e) => {
                                    setIsShowDevices(!isShowDevices);
                                }}
                            >
                                <div className="">
                                    <b className="text-gray-600 pl-3">Device</b>
                                    <p
                                        className="font-seconds
                                        bg-gray-100
                                        rounded-md
                                        w-18
                                        px-4
                                        text-gray-700
                                        relative
                                        text-right
                                        before:content-['']
                                        before:absolute
                                        before:w-2
                                        before:h-2
                                        before:rounded-full
                                        before:bottom-0
                                        before:left-1
                                        before:-translate-y-[100%]
                                        before:bg-gray-500
              
              "
                                    >
                                        Online
                                    </p>
                                </div>

                                <TfiWallet className="text-2xl" />
                            </div>
                            <div className="flex flex-row-reverse  min-w-24 px-4 py-px cursor-pointer bg-bgMain  hover:bg-slate-300 rounded-lg gap-x-4 items-center">
                                <div className="">
                                    <b className="text-gray-600 pl-3">Things</b>
                                </div>
                                <BiNotification className="text-2xl" />
                            </div>
                            {isShowDevices && (
                                <OverLay
                                    onClose={(e) => {
                                        setIsShowDevices(!isShowDevices);
                                    }}
                                >
                                    <div className="bg-white max-w-md w-[500px] min-h-min my-auto  space-y-4 shadow-sm mx-auto rounded-md p-2  overflow-y-auto">
                                        <div
                                            className="mb-4 flex justify-end
               
              "
                                        >
                                            <button
                                                onClick={(e) => {
                                                    setIsShowDevices(false);
                                                }}
                                                className="bg-gray-200 rounded-full w-8 h-8 inline-flex 
               items-center justify-center shadow-sm "
                                            >
                                                <HiOutlineXMark className="text-2xl text-gray-700 rounded-full " />
                                            </button>
                                        </div>
                                        {state.devices.map((value) => {
                                            return (
                                                <div
                                                    key={value.id}
                                                    className="flex h-12 items-center text-gray-800  shadow-sm rounded-md
                        bg-gradient-to-r from-indigo-300  px-2 to-purple-400 justify-between"
                                                >
                                                    <p className="">
                                                        {value.name}
                                                    </p>
                                                    <button className="px-4 py-2  bg-blue-500/90 hover:opacity-90 text-white font-medium  shadow-md rounded-md ">
                                                        Online
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </OverLay>
                            )}
                        </div>
                    ) : (
                        <div className="ml-auto">
                            <Link
                                to="/sign-in"
                                className="px-8 py-3 rounded-md font-seconds text-xl  bg-blue-500
              shadow-xs text-white
              hover:opacity-90
               "
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;

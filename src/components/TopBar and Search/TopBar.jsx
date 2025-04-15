

// import React, { useEffect, useState } from "react";
// import { auth } from "../firebase/db.config";
// import { signOut, onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase/db.config";
// import SearchResult from "./SearchResult";
// import { FaRegUser, FaSignOutAlt, FaSearch } from "react-icons/fa";
// import {filteredUsers} from "./RoleManager"

// const TopBar = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState("Người dùng");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isFocused, setIsFocused] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       setLoading(true);
//       if (currentUser) {
//         try {
//           const userDocRef = doc(db, "users", currentUser.uid);
//           const userDocSnap = await getDoc(userDocRef);
//           setUserName(userDocSnap.exists() ? userDocSnap.data().name || "Người dùng" : "Người dùng");
//         } catch (error) {
//           console.error("Lỗi khi lấy thông tin người dùng:", error);
//         }
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/sign-in");
//     } catch (error) {
//       console.error("Lỗi khi đăng xuất:", error);
//     }
//   };

//   const handleSelectDevice = (device) => {
//     setSearchTerm(device.name);
//     setIsFocused(false);
//     navigate(`/device/${device.id}`);
//   };

//   return (
//     <div className="w-full min-h-16 bg-gray-900   text-black flex items-center px-6 justify-between">
//       <h1 className="text-xl font-semibold text-white">HTR-HueTronics</h1>
      
//       {/* Ô tìm kiếm */}
//       <div className="relative w-64 flex items-center bg-gray-600 rounded-lg px-3 py-2">
//         <FaSearch className="text-gray-400 mr-2" />
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setTimeout(() => setIsFocused(false), 200)}
//           placeholder="Tìm kiếm thiết bị..."
//           className="w-full bg-gray-600 outline-none text-white border-none   focus:ring-0 "
//         />
//         {isFocused && <SearchResult searchTerm={searchTerm} onSelectDevice={handleSelectDevice} />}
//       </div>

//       {/* Thông tin người dùng */}
//       <div className="flex items-center space-x-4">
//         {loading ? (
//           <span className="text-gray-400">Đang tải...</span>
//         ) : user ? (
//           <div className="flex items-center space-x-3">
//             <FaRegUser className="text-gray-300 text-lg" />
//             <span className="text-white font-medium">{userName}</span>
//             <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center">
//               <FaSignOutAlt className="mr-2" /> Đăng xuất
//             </button>
//           </div>
//         ) : (
//           <button onClick={() => navigate("/sign-in")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg">
//             Đăng nhập
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TopBar;

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

const TopBar = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Người dùng");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const  [isShowDevices,setIsShowDevices] = useState(false)
  const {state,dispatch} = useContext(context)


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
          setUserName(userDocSnap.exists() ? userDocSnap.data().name || "Người dùng" : "Người dùng");
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
              ? item.name?.toLowerCase().includes(searchTerm.toLowerCase())
              : item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setSearchResults(results);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    };

    fetchData();
  }, [searchTerm, location.pathname]);

  // return (
  //   <div className="fixed w-full min-h-16 bg-gray-900 text-black flex items-center px-6 justify-between">
  //     <h1 className="text-xl font-semibold text-white">HTR-HueTronics</h1>

  //     {/* Ô tìm kiếm */}
  //     <div className="relative w-64 flex items-center bg-gray-600 rounded-lg px-3 py-2">
  //       <FaSearch className="text-gray-400 mr-2" />
  //       <input
  //         type="text"
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //         onFocus={() => setIsFocused(true)}
  //         onBlur={() => setTimeout(() => setIsFocused(false), 200)}
  //         placeholder={placeholderText}
  //         className="w-full bg-gray-600 outline-none text-white border-none focus:ring-0"
  //       />
  //       {isFocused && searchResults.length > 0 && (
  //         <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
  //           {searchResults.map((result) => (
  //             <div
  //               key={result.id}
  //               className="p-2 hover:bg-gray-200 cursor-pointer"
  //               onClick={() => {
  //                 setSearchTerm(location.pathname.includes("device") ? result.name : result.email);
  //                 setIsFocused(false);
  //                 navigate(location.pathname.includes("device") ? `/device/${result.id}` : `/user/${result.id}`);
  //               }}
  //             >
  //               {location.pathname.includes("device") ? result.name : result.name}
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>

  //     <div className="flex items-center space-x-4">
  //       {loading ? (
  //         <span className="text-gray-400">Đang tải...</span>
  //       ) : ('')}
  //     </div>
  //   </div>
  // );


  const handleSelectSearchResult = (result) => {
    setSearchTerm(location.pathname.includes("device") ? result.name : result.email);
    setIsFocused(false);
    navigate(location.pathname.includes("device") ? `/device/${result.id}` : `/user/${result.id}`);
  };

  
  return(
    <div className={
      `fixed ${user ?('min-w-top-bar'):('min-w-full')} p-2 min-h-16 z-50 font-primary  border-b border-gray-300 top-0 right-0  bg-white`//fixed ${user ?('min-w-top-bar'):('min-w-full')} bị lỗi
      //  "fixed w-full p-2 min-h-16 z-50 font-primary border-b border-gray-300 top-0 right-0 bg-white"

    }>
    <div>
        <div className="flex items-center">
          <div className="inline-flex  text-blue-500 text-3xl gap-x-2 items-center">
            <AiFillOpenAI className="text-5xl text-blue-500"/>
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


          { (user) ?
            (<div className="flex  gap-x-4 ml-auto">
              
            <div className="flex flex-row-reverse  min-w-24 px-4 py-px cursor-pointer bg-bgMain  hover:bg-slate-300 rounded-lg gap-x-4 items-center"
               onClick={(e)=>{
               
                setIsShowDevices(!isShowDevices)
              }}
              >
              <div className=""><b className="text-gray-600 pl-3">Device</b>
              <p className="font-seconds
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
              
              ">Online</p></div>

            <TfiWallet className="text-2xl"/>
            </div>
            <div className="flex flex-row-reverse  min-w-24 px-4 py-px cursor-pointer bg-bgMain  hover:bg-slate-300 rounded-lg gap-x-4 items-center">
              <div className=""><b className="text-gray-600 pl-3">Things</b>
              </div>
            <BiNotification className="text-2xl"/>
            </div>
           { (isShowDevices) && <div  id="allDevices" className="fixed inset-0 flex   p-4 bg-black/10 ">
           
              <div className="bg-white max-w-md w-[500px] min-h-min my-auto  space-y-4 shadow-sm mx-auto rounded-md p-2  overflow-y-auto">
              <div className="mb-4 flex justify-end
               
              "><button onClick={(e)=>{
                setIsShowDevices(false)
              }} className="bg-gray-200 rounded-full w-8 h-8 inline-flex 
               items-center justify-center shadow-sm "><HiOutlineXMark className="text-2xl text-gray-700 rounded-full "/></button></div>
                  {
                    state.devices.map((value)=>{
                      return  (
                        <div key={value.id}  className="flex h-12 items-center text-gray-800  shadow-sm rounded-md
                        bg-gradient-to-r from-indigo-300  px-2 to-purple-400 justify-between"><p className="">
                          {value.name  }
                        </p>
                        <button className="px-4 py-2  bg-blue-500/90 hover:opacity-90 text-white font-medium  shadow-md rounded-md ">Online</button>
                         </div>
                      )
                    })
                  }
              </div>
              
              </div>}
            

          </div>):(
            <div className="ml-auto">
              <Link to='/sign-in' className="px-8 py-3 rounded-md font-seconds text-xl  bg-blue-500
              shadow-xs text-white
              hover:opacity-90
               ">Sign In</Link>
            </div>
          )
          }
        </div>
    </div>
    </div>
  )
};

export default TopBar;
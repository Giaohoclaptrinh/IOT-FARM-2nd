// import React, { useEffect, useState } from "react";
// import { auth, db } from "../firebase/db.config";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
// import DeviceChart from "../components/DeviceChart";
// import RoleManager from "../components/RoleManager";
// import DeviceList from "@/components/DeviceList";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [devices, setDevices] = useState([]);
//   const [selectedDevice, setSelectedDevice] = useState(null);
//   const [selectedFunction, setSelectedFunction] = useState("devices");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const userDoc = await getDoc(doc(db, "users", currentUser.uid));
//         if (userDoc.exists()) {
//           setUserName(userDoc.data().name);
//           setUserRole(userDoc.data().role || 'client');
//         }

//         // Lấy thiết bị dựa trên quyền
//         const devicesQuery = userRole === "admin"
//           ? collection(db, "devices") // Admin xem toàn bộ thiết bị
//           : query(collection(db, "devices"), where("userId", "==", currentUser.uid));

//         const unsubscribeDevices = onSnapshot(devicesQuery, (snapshot) => {
//           setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         });

//         return () => unsubscribeDevices();
//       }
//     });

//     return () => unsubscribe();
//   }, [userRole]);

//   return (
//     <div className="p-6 h-full max-w-full overflow-auto bg-gray-100">
//       <h1 className="text-2xl font-bold">Chào mừng, {userName}! 👋</h1>
//       <p className="text-gray-600">Quyền hạn: {userRole}</p>

//       {userRole === "admin" && (
//         <div className="flex space-x-4 mt-6">
//           <button onClick={() => setSelectedFunction("roleManagement")} className={`px-4 py-2 rounded-lg shadow ${selectedFunction === "roleManagement" ? "bg-blue-500 text-white" : "bg-white"}`}>
//             Quản lý phân quyền
//           </button>
//           <button onClick={() => setSelectedFunction("devices")} className={`px-4 py-2 rounded-lg shadow ${selectedFunction === "devices" ? "bg-blue-500 text-white" : "bg-white"}`}>
//             Thiết bị của bạn
//           </button>
//         </div>
//       )}

//       <div className="mt-6">
//         {selectedFunction === "roleManagement" && userRole === "admin" && <RoleManager />}
//         {selectedFunction === "devices" && (
//           <>
//             <h2 className="text-xl font-semibold mb-4">Thiết bị của bạn</h2>
//             <DeviceList devices={devices} setSelectedDevice={setSelectedDevice} />
//             {selectedDevice && (
//               <div className="mt-8 p-4 border rounded-lg shadow bg-white">
//                 <h2 className="text-lg font-semibold">Dữ liệu thiết bị: {selectedDevice}</h2>
//                 <DeviceChart deviceId={selectedDevice} />
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

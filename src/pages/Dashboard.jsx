// import React, { useEffect, useState } from "react";
//import { auth } from "../firebase/db.config";
// import { onAuthStateChanged } from "firebase/auth";
 //import { doc, getDoc } from "firebase/firestore";
 //import { db } from "../firebase/db.config";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         try {
//           // Lấy dữ liệu từ Firestore
//           const userDoc = await getDoc(doc(db, "users", currentUser.uid));
//           if (userDoc.exists()) {
//             setUserName(userDoc.data().name);
//           }
//         } catch (error) {
//           console.error("Lỗi khi lấy dữ liệu người dùng:", error);
//         }
//       } else {
//         setUserName("");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Chào mừng, {userName || "Người dùng"}! 👋</h1>
//       <p className="mt-2 text-gray-600">Đây là bảng điều khiển của bạn.</p>
//     </div>
//   );
// };



// export default Dashboard;
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import DeviceChart from "../components/DeviceChart";
import RoleManager from "../components/RoleManager";
import DeviceList from "@/components/DeviceList";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState("devices"); // Mặc định hiển thị danh sách thiết bị

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
            setUserRole(userDoc.data().role || 'client');
          }

          // Lấy danh sách thiết bị
          const devicesQuery = query(
            collection(db, "devices"),
            where("userId", "==", currentUser.uid)
          );

          const unsubscribeDevices = onSnapshot(devicesQuery, (snapshot) => {
            const devicesList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setDevices(devicesList);
          });

          return () => unsubscribeDevices();
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 h-full max-w-full overflow-auto bg-gray-100">
      <h1 className="text-2xl font-bold">Chào mừng, {userName}! 👋</h1>
      <p className="text-gray-600">Quyền hạn: {userRole}</p>

      {/* Menu chọn chức năng */}
      {userRole === "admin" && (
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setSelectedFunction("roleManagement")}
            className={`px-4 py-2 rounded-lg shadow ${
              selectedFunction === "roleManagement" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Quản lý phân quyền
          </button>
          <button
            onClick={() => setSelectedFunction("devices")}
            className={`px-4 py-2 rounded-lg shadow ${
              selectedFunction === "devices" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Thiết bị của bạn
          </button>
        </div>
      )}

      {/* Hiển thị nội dung dựa trên chức năng đã chọn */}
      <div className="mt-6">
        {selectedFunction === "roleManagement" && <RoleManager />}
        {selectedFunction === "devices" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Thiết bị của bạn</h2>
            <DeviceList devices={devices} setSelectedDevice={setSelectedDevice} />

            {selectedDevice && (
              <div className="mt-8 p-4 border rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold bg-white">Dữ liệu thiết bị: {selectedDevice}</h2>
                <DeviceChart deviceId={selectedDevice} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

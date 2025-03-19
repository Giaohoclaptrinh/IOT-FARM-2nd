// import React, { useEffect, useState } from "react";
import { auth } from "../firebase/db.config";
 import { onAuthStateChanged } from "firebase/auth";
 //import { doc, getDoc } from "firebase/firestore";
 import { db } from "../firebase/db.config";

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
//import { auth, db } from "../firebase/db.config";
//import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import DeviceChart from "../components/DeviceChart";
import RoleManager from "../components/RoleManager";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Chào mừng, {userName}! 👋</h1>
        <p className="text-gray-600">Quyền hạn: {userRole}</p>
      </div>

      {userRole === 'admin' && (
        <div className="mb-8">
          <RoleManager />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Thiết bị của bạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map(device => (
            <div
              key={device.id}
              className={`p-4 rounded-lg shadow cursor-pointer transition-all ${
                selectedDevice === device.id ? 'bg-blue-100 border-blue-500' : 'bg-white'
              }`}
              onClick={() => setSelectedDevice(device.id)}
            >
              <h3 className="font-semibold">{device.name}</h3>
              <p className={`text-sm ${device.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
                {device.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedDevice && (
        <div className="mt-8">
          <DeviceChart deviceId={selectedDevice} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
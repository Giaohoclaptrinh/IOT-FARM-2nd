import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/db.config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import DeviceChart from "../components/DeviceChart";
import RoleManager from "../components/RoleManager";
import DeviceList from "@/components/DeviceList";
import SearchResult from "@/components/SearchResult";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState("devices");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
          setUserRole(userDoc.data().role || 'client');
        }

        const devicesQuery = userRole === "admin"
          ? collection(db, "devices")
          : query(collection(db, "devices"), where("userId", "==", currentUser.uid));

        const unsubscribeDevices = onSnapshot(devicesQuery, (snapshot) => {
          setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribeDevices();
      }
    });

    return () => unsubscribe();
  }, [userRole]);

  return (
    <div className="px-8 py-6 h-full max-w-full overflow-auto bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển</h1>
      
      {userRole === "admin" && (
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setSelectedFunction("roleManagement")} 
            className={`px-4 py-2 rounded-lg shadow transition-colors ${selectedFunction === "roleManagement" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}>
            Quản lý phân quyền
          </button>
          <button onClick={() => setSelectedFunction("devices")} 
            className={`px-4 py-2 rounded-lg shadow transition-colors ${selectedFunction === "devices" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}>
            Thiết bị của bạn
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {selectedFunction === "roleManagement" && userRole === "admin" && <RoleManager />}
        {selectedFunction === "devices" && (
          <>
            <DeviceList devices={devices} setSelectedDevice={setSelectedDevice} />
            {selectedDevice && (
              <div className="mt-6 p-6 border rounded-lg shadow bg-blue-50">
                <h2 className="text-lg font-semibold text-gray-700">Thiết Bị: {selectedDevice}</h2>
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

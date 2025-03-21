import React from "react";

const DeviceOverview = () => {
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
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold mb-2">Tổng quan thiết bị</h2>
      <p className="text-gray-700">Hiện có <strong>10</strong> thiết bị trong hệ thống.</p>
    </div>
  );
};

export default DeviceOverview;

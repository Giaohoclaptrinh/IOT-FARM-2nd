import React, { useState, useEffect } from "react";
import { db, auth } from '@/firebase/db.config';
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const RoleManager = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const role = userSnap.data().role || "client";
            setCurrentUser({ id: user.uid, role });
          } else {
            console.warn("Không tìm thấy user:", user.uid);
            setCurrentUser({ id: user.uid, role: "client" }); // fallback an toàn
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user:", error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        setUsers(
          userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
      }
    };

    fetchUsers();

    return () => unsubscribeAuth();
  }, []);

  const updateUserRole = async (id, newRole) => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Bạn không có quyền thay đổi vai trò!");
      return;
    }
    if (id === currentUser.id) {
      alert("Bạn không thể thay đổi quyền của chính mình!");
      return;
    }

    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật quyền người dùng:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       user.name?.toLowerCase().includes(searchQuery.toLowerCase())))


  if (currentUser === null) {
    return <div className="text-center p-4">Đang tải...</div>;
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="text-red-500 text-center p-4">
        Bạn không có quyền truy cập trang này!
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Quản lý người dùng</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2 w-1/4">Họ tên</th>
              <th className="text-left p-2 w-1/4">Email</th>
              <th className="text-left p-2 w-1/4">Quyền hiện tại</th>
              <th className="text-left p-2 w-1/4">Thay đổi quyền</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2 whitespace-nowrap">{user.name || "-"}</td>
                <td className="p-2 whitespace-nowrap">{user.email}</td>
                <td className="p-2">{user.role || "client"}</td>
                <td className="p-2">
                  {user.id !== currentUser.id && (
                    <select
                      value={user.role || "client"}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="border p-1 rounded w-full"
                    >
                      <option value="client">Client</option>
                      <option value="staff">Staff</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td className="p-2" colSpan="4">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManager;

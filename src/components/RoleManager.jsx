import React, { useEffect, useState } from 'react';
import { db } from '../firebase/db.config';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const RoleManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật role:', error);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Quản lý phân quyền</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left w-1/12 py-2 bg-center ">Tên</th>
              <th className="text-left w-1/12 py-2 bg-center ">Email</th>
              <th className="text-left w-1/12 py-2 bg-center">Quyền hiện tại</th>
              <th className="text-left w-1/12 py-2 bg-center">Thay đổi quyền</th>
            </tr>
          </thead>
          <tbody>
            {console.log(users)}
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2 ">{user.name}</td>
                <td className="px-4 py-2 ">{user.email}</td>
                <td className="px-4 py-2 ">{user.role || 'client'}</td>
                <td className="px-4 py-2 ">
                  <select
                  
                    value={user.role || 'client'}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="client">Client</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManager;
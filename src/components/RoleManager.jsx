import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/db.config';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const RoleManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, role: userDoc.data().role });
        }
      }
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  const updateUserRole = async (userId, newRole) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setMessage({ type: 'error', text: 'Bạn không có quyền thay đổi vai trò!' });
      return;
    }
    if (userId === currentUser.id) {
      setMessage({ type: 'error', text: 'Bạn không thể thay đổi quyền của chính mình!' });
      return;
    }
    
    const targetUser = users.find(user => user.id === userId);
    if (targetUser && targetUser.role === 'admin') {
      setMessage({ type: 'error', text: 'Bạn không thể thay đổi quyền của một admin khác!' });
      return;
    }
    
    if (newRole === 'admin') {
      setMessage({ type: 'error', text: 'Bạn không thể nâng người dùng lên admin!' });
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setMessage({ type: 'success', text: 'Cập nhật vai trò thành công!' });
    } catch (error) {
      console.error('Lỗi khi cập nhật role:', error);
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật vai trò!' });
    }
  };

  if (loading) return <div className='text-center p-4'>Đang tải...</div>;
  if (!currentUser || currentUser.role !== 'admin') {
    return <div className='text-red-500 text-center p-4'>Bạn không có quyền truy cập trang này!</div>;
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Quản lý phân quyền</h2>
      {message && (
        <div className={`p-2 mb-4 text-center ${message.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}
      <table className='min-w-full border rounded-lg'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='py-2 px-4'>Tên</th>
            <th className='py-2 px-4'>Email</th>
            <th className='py-2 px-4'>Quyền hiện tại</th>
            <th className='py-2 px-4'>Thay đổi quyền</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className='border-b text-center'>
              <td className='py-2 px-4'>{user.name}</td>
              <td className='py-2 px-4'>{user.email}</td>
              <td className='py-2 px-4'>{user.role || 'client'}</td>
              <td className='py-2 px-4'>
                {user.id !== currentUser.id && user.role !== 'admin' && (
                  <select
                    value={user.role || 'client'}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className='border rounded px-2 py-1'>
                    <option value='client'>Client</option>
                    <option value='staff'>Staff</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManager;

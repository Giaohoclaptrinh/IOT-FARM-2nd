import React, { useEffect, useState } from "react";
import { auth } from "../firebase/db.config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where , orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import { db } from "../firebase/db.config"; 


const TopBar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // Thêm state loading
  const navigate = useNavigate();
  const [search , setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  console.log(search)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserName(userDocSnap.data().name || "Người dùng");
          } else {
            setUserName("Người dùng");
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          setUserName("Người dùng");
        }
      } else {
        setUserName(""); // Không có user thì reset lại tên
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };
  const handleSearch = async (e) => {
    const value = e.target.value.trim();
    setSearch(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    try {
      const usersRef = collection(db, "devices"); 
      const q = query(
        usersRef, 
        orderBy("name"),
        startAt(value),
        endAt(value + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSuggestions(results);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };
    const handleSelect = (item) => {
    setSearch(item.name); // Gán tên thiết bị vào ô tìm kiếm
    setSuggestions([]); // Ẩn danh sách gợi ý
  
    // Điều hướng hoặc hiển thị thông tin thiết bị
    navigate(`/device/${item.id}`); // ⚡ Nếu có trang chi tiết thiết bị
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={handleSearch} 
          placeholder="Tìm kiếm..."
          className="border  rounded-lg px-3 py-2 w-64"
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-lg mt-1 w-64 shadow-lg">
            {suggestions.map((item) => (
              <li 
                key={item.id} 
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(item)} // ⚡ Click để chọn
              >
                {item.name}
              </li>  
            ))}
          </ul>
)}

      </div>

      {loading ? (
        <span className="text-gray-500">Đang tải...</span>
      ) : user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">👤 {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/sign-in")}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
};

export default TopBar;

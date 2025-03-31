import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase/db.config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
  
    const user = auth.currentUser;
    if (!user) {
      console.error("Người dùng chưa đăng nhập!");
      return;
    }
  
    await addDoc(collection(db, "messages"), {
      name: user.displayName || user.email || "Ẩn danh", 
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    
    setNewMessage("");
    console.log("Người dùng hiện tại:", auth.currentUser);

  };
  

  return (
    <div className="fixed bottom-5 right-5">
      {/* Nút mở chatbox */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center"
      >
        💬 Chat online
      </button>

      {/* Chatbox hiển thị khi isOpen = true */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-white shadow-lg border rounded-lg p-3">
          <div className="h-60 overflow-y-auto border-b pb-2">
                            {messages.map((msg, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded-lg my-1 shadow">
                        <strong>{msg.name || msg.email}:</strong> {msg.text}
                    </div>
                    ))}

          </div>
          <div className="flex mt-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded-r"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

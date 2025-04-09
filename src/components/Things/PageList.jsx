import React, { useEffect, useState } from "react";
import { getUserPages, addPage } from "@/utils/FireStoreUtils";
import { auth } from "@/firebase/db.config";
import AddPageModal from "./AddPageModal";

const PageList = ({ onSelectPage }) => {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  
  useEffect(() => {
    const fetchPages = async () => {
      const user = auth.currentUser;
      if (user) {
        const pages = await getUserPages(user.uid);
        setPages(pages);
      }
    };
    fetchPages();
    
  }, []);

  const handleAddPage = async (name) => {
    const user = auth.currentUser;
    if (!user) return;
    await addPage(name, user.uid);
    const updated = await getUserPages(user.uid);
    setPages(updated);
    setShowModal(false);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="mb-4 bg-blue-500 text-white p-2 rounded">+ Tạo Page</button>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <button
              onClick={() => onSelectPage(page.id)}
              className="block w-full text-left p-2 bg-slate-100 hover:bg-slate-300 rounded"
            >
              {page.id}
            </button>
          </li>
        ))}
      </ul>
      {showModal && <AddPageModal onClose={() => setShowModal(false)} onSubmit={handleAddPage} />}
    </>
  );
};

export default PageList;

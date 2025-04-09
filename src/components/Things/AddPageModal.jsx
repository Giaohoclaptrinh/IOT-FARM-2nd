import React, { useState } from "react";

const AddPageModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Tạo Page mới</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Tên Page"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Huỷ</button>
          <button onClick={() => onSubmit(name)} className="px-4 py-2 bg-blue-500 text-white rounded">Tạo</button>
        </div>
      </div>
    </div>
  );
};

export default AddPageModal;

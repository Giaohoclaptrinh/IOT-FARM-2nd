import React, { useState } from "react";
import OverLay from "../Utilities/OverLay";

const AddPageModal = ({ onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [show, setShow] = useState(true);
    return (
        show && (
            <OverLay onClose={onClose}>
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
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={() => onSubmit(name)}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            </OverLay>
        )
    );
};

export default AddPageModal;

import React, { useEffect, useState } from "react";

const OverLay = ({ children, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center"
            onClick={onClose} // click nền đen thì đóng
        >
            <div
                className="bg-white rounded-2xl relative"
                onClick={(e) => e.stopPropagation()} // click vào content thì không bị đóng
            >
                {children}
            </div>
        </div>
    );
};

export default OverLay;

import React, { useEffect, useState } from "react";

const OverLay = ({ children, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="bg-white rounded-2xl relative"
                onClick={(e) => e.stopPropagation()} // Ngăn nổi bọt
            >
                {children}
            </div>
        </div>
    );
};

export default OverLay;

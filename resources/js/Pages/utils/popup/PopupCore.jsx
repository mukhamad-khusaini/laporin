import React from "react";
import { useRef, useEffect } from "react";

const PopupCore = ({ isOpen, onClose, onSubmit, children }) => {
    const popupRef = useRef();

    // Tutup popup jika klik di luar kotak
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div
                ref={popupRef}
                className="bg-white p-6 rounded shadow-lg w-full max-w-xl space-y-4 relative"
            >
                <h2 className="text-lg font-semibold">Tambah Transaksi</h2>
                {children}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupCore;

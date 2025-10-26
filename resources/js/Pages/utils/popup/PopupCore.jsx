import React from "react";

const PopupCore = ({ isOpen, onClose, onSubmit, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl space-y-4">
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

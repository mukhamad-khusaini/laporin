import React from "react";

const TableCore = ({ children, onSearch, onAdd }) => {
    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Cari transaksi..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="border px-3 py-1 rounded w-1/3"
                />
                <button
                    onClick={onAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Tambah Transaksi
                </button>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
                <table className="w-full border rounded text-sm">
                    {children}
                </table>
            </div>
        </div>
    );
};

export default TableCore;

import React from "react";

const TableBody = ({ data, renderRow }) => {
    return (
        <tbody>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                        <span className="italic">Tidak ada data</span> 😕
                    </td>
                </tr>
            ) : (
                data.map((item, idx) => (
                    <tr key={idx} className="h-auto border-t hover:bg-gray-50">
                        {renderRow(item, idx)}
                    </tr>
                ))
            )}
        </tbody>
    );
};

export default TableBody;

// TAMBAHKAN KOLOM JUMLAH PADA POPUP TRANSAKSI PENJUALAN

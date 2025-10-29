import React from "react";

const InputKeterangan = ({ value, hendleSetValue }) => (
    <div className="space-y-1">
        <label className="text-sm text-gray-700">Deskripsi Transaksi </label>
        <textarea
            value={value}
            onChange={(e) => hendleSetValue(e.target.value)}
            placeholder="Masukan keterangan transaksi"
            className="border rounded px-3 py-2 w-full resize-none"
        />
    </div>
);

export default InputKeterangan;

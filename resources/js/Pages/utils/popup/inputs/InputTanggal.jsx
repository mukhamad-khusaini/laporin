import React from "react";

const InputTanggal = ({ value, hendleSetValue }) => (
    <div className="space-y-1">
        <label className="text-sm text-gray-700">
            Tanggal & Jam Transaksi <span className="text-red-500">*</span>
        </label>
        <input
            type="datetime-local"
            value={value}
            onChange={(e) => hendleSetValue(e.target.value)}
            className="border rounded px-3 py-1 w-full"
            required
        />
    </div>
);

export default InputTanggal;

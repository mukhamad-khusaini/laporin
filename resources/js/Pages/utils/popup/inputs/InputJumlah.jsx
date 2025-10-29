import React from "react";

const InputJumlah = ({ value, hendleSetValue, name }) => (
    <div className="space-y-1">
        <label className="text-sm text-gray-700">
            Jumlah {name} <span className="text-red-500">*</span>
        </label>
        <input
            type="number"
            value={value}
            onChange={(e) => hendleSetValue(e.target.value)}
            placeholder="Masukkan jumlah"
            className="border rounded px-3 py-1 w-full"
            required
        />
    </div>
);

export default InputJumlah;

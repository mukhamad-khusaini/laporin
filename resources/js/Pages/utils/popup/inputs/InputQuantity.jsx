import React from "react";

const InputQuantity = ({ value, hendleSetValue, name }) => (
    <div className="space-y-1">
        <label className="text-sm text-gray-700">
            Jumlah {name} <span className="text-red-500">*</span>
        </label>
        <input
            type="number"
            min={1}
            value={value}
            onChange={(e) => hendleSetValue(e.target.value)}
            placeholder="Masukkan kuantitas"
            className="border rounded px-3 py-1 w-full"
            required
        />
    </div>
);

export default InputQuantity;

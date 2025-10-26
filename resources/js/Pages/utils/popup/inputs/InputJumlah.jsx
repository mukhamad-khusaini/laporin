import React from "react";

const InputJumlah = ({ data, setData }) => (
    <div>
        <label className="text-sm">Jumlah</label>
        <input
            type="number"
            value={data.amount}
            onChange={(e) => setData("amount", e.target.value)}
            className="border px-3 py-1 rounded w-full"
        />
    </div>
);

export default InputJumlah;

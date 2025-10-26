import React from "react";

const formatDatetimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
};

const InputTanggal = ({ data, setData }) => (
    <div>
        <label className="text-sm">Tanggal & Jam</label>
        <input
            type="datetime-local"
            value={formatDatetimeLocal(data.transaction_date)}
            onChange={(e) => setData("transaction_date", e.target.value)}
            className="border px-3 py-1 rounded w-full"
        />
    </div>
);

export default InputTanggal;

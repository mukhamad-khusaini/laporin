import React from "react";

const InputSubLedger = ({ data, setData, options, onAdd }) => (
    <div>
        <label className="text-sm flex justify-between">
            Sub Ledger
            <button
                type="button"
                onClick={onAdd}
                className="text-blue-600 text-xs underline"
            >
                Tambah
            </button>
        </label>
        <select
            value={data.sub_ledger}
            onChange={(e) => setData("sub_ledger", e.target.value)}
            className="border px-3 py-1 rounded w-full"
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default InputSubLedger;

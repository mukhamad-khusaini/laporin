import React from "react";

const InputAkun = ({ data, setData, options }) => (
    <div>
        <label className="text-sm">Akun</label>
        <select
            value={data.account_type}
            onChange={(e) => setData("account_type", e.target.value)}
            className="border px-3 py-1 rounded w-full"
        >
            <option className="bg-gray-300" value="">
                Pilih akun
            </option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default InputAkun;

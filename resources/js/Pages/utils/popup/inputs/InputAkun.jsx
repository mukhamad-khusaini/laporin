import React from "react";

const InputAkun = ({ value, hendleSetvalue, options }) => (
    <div className="space-y-1">
        <label className="text-sm text-gray-700">
            Nama Akun <span className="text-red-500">*</span>
        </label>
        <select
            value={value}
            onChange={(e) => hendleSetvalue(e.target.value)}
            className="border rounded px-3 py-1 w-full"
            required
        >
            <option value="">Pilih akun</option>
            {options.map((akun) => (
                <option key={akun} value={akun}>
                    {akun}
                </option>
            ))}
        </select>
    </div>
);

export default InputAkun;

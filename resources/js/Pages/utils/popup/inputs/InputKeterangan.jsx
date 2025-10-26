import React from "react";

const InputKeterangan = ({ data, setData }) => (
    <div>
        <label className="text-sm">Keterangan</label>
        <textarea
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="border px-3 py-1 rounded w-full"
        />
    </div>
);

export default InputKeterangan;

import React from "react";

const TableHead = ({ columns }) => {
    return (
        <thead className="bg-gray-100">
            <tr>
                {columns.map((col, idx) => (
                    <th key={idx} className="px-4 py-2 text-left text-gray-700">
                        {col}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHead;

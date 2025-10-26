import React from "react";

const TableBody = ({ data, renderRow }) => {
    return (
        <tbody>
            {data.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                    {renderRow(item)}
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;

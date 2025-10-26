import React from "react";

const TableBody = ({ data, renderRow }) => {
    return (
        <tbody>
            {data.map((item, idx) => (
                <tr key={idx} className="h-auto border-t hover:bg-gray-50">
                    {renderRow(item, idx)}
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;

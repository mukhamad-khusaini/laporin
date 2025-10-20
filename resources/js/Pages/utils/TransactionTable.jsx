import { useState, useEffect, useMemo } from "react";
import React from "react";

export default function TransactionTable({ data: rawInput }) {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Normalisasi data
    useEffect(() => {
        if (Array.isArray(rawInput)) {
            setData(rawInput);
        } else if (rawInput?.data && Array.isArray(rawInput.data)) {
            setData(rawInput.data);
        } else {
            console.warn("Format data tidak dikenali:", rawInput);
            setData([]);
        }
    }, [rawInput]);

    // Filter berdasarkan search
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(
            (group) =>
                group.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                group.transaction_date
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                group.details.some(
                    (d) =>
                        d.account
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        (d.sub_ledger ?? "")
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                )
        );
    }, [searchTerm, data]);

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex justify-end">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded px-3 py-1 text-sm w-60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100 text-left text-sm text-gray-700">
                        <tr>
                            <th className="px-4 py-2 w-12">No.</th>
                            <th className="px-4 py-2 w-32">Tanggal</th>
                            <th className="px-4 py-2 w-48">Deskripsi</th>
                            <th className="px-4 py-2">Akun</th>
                            <th className="px-4 py-2 text-right">Debit</th>
                            <th className="px-4 py-2 text-right">Kredit</th>
                            <th className="px-4 py-2">Sub Ledger</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-6 text-gray-500"
                                >
                                    <span className="italic">
                                        Belum ada data
                                    </span>{" "}
                                    😕
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((group, idx) => (
                                <React.Fragment key={idx}>
                                    {group.details.map((d, i) => (
                                        <tr
                                            key={i}
                                            className={`border-t ${
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            } hover:bg-blue-50`}
                                        >
                                            <td className="px-4 py-2">
                                                {i === 0 ? idx + 1 : ""}
                                            </td>
                                            <td className="px-4 py-2">
                                                {i === 0
                                                    ? group.transaction_date
                                                    : ""}
                                            </td>
                                            <td className="px-4 py-2">
                                                {i === 0
                                                    ? group.description
                                                    : ""}
                                            </td>
                                            <td className="px-4 py-2">
                                                {d.account}
                                            </td>
                                            <td className="px-4 py-2 text-right bg-green-100">
                                                {d.debit == 0
                                                    ? ""
                                                    : d.debit.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 text-right bg-red-100">
                                                {d.credit == 0
                                                    ? ""
                                                    : d.credit.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {d.sub_ledger ?? ""}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

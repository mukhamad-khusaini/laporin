import { useState, useEffect, useMemo } from "react";

export default function TailwindTable({ columns, jsonUrl }) {
    const [rawData, setRawData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data dari file JSON
    useEffect(() => {
        fetch(jsonUrl)
            .then((res) => res.json())
            .then((res) => {
                const loaded = res.data || res; // support format { data: [...] } atau langsung array
                setRawData(loaded);
            })
            .catch((err) => console.error("Gagal memuat data JSON:", err));
    }, [jsonUrl]);

    // Filter berdasarkan search
    const filteredData = useMemo(() => {
        if (!searchTerm) return rawData;
        return rawData.filter((row) =>
            columns.some((col) =>
                String(row[col.accessor])
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, rawData, columns]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entriesPerPage;
        return filteredData.slice(start, start + entriesPerPage);
    }, [filteredData, currentPage, entriesPerPage]);

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex justify-between items-center">
                <div>
                    <label className="text-sm text-gray-700 mr-2">
                        Entries per page:
                    </label>
                    <select
                        value={entriesPerPage}
                        onChange={(e) => {
                            setEntriesPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        {[5, 10, 25, 50].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded px-3 py-1 text-sm w-1/3"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100 text-left text-sm text-gray-700">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.accessor} className="px-4 py-2">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {paginatedData.map((row, idx) => (
                            <tr key={idx} className="border-t">
                                {columns.map((col) => (
                                    <td
                                        key={col.accessor}
                                        className="px-4 py-2"
                                    >
                                        {row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm text-gray-700">
                <span>
                    Showing{" "}
                    {Math.min(
                        (currentPage - 1) * entriesPerPage + 1,
                        filteredData.length
                    )}{" "}
                    to{" "}
                    {Math.min(
                        currentPage * entriesPerPage,
                        filteredData.length
                    )}{" "}
                    of {filteredData.length} entries
                </span>
                <div className="space-x-1">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

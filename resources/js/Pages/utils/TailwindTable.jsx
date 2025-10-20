import { useState, useEffect, useMemo } from "react";

export default function TailwindTable({
    columns,
    data: rawInput,
    transaksi = null,
}) {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Normalisasi data: array langsung atau { data: [...] }
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
        return data.filter((row) =>
            columns.some((col) =>
                String(row[col.accessor] ?? "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, data, columns]);

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
                        className="border rounded px-2 py-1 text-sm w-14"
                    >
                        {[5, 10, 25, 50].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end w-3/6">
                    {transaksi && (
                        <button
                            onClick={() => console.log("tambah")}
                            className="mr-4 flex items-center bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                        >
                            <span className="mr-2">
                                Tambah transaksi {transaksi}
                            </span>
                            <span className="text-lg font-bold">+</span>
                        </button>
                    )}

                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded px-3 py-1 text-sm w-60"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
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
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-6 text-gray-500"
                                >
                                    <span className="italic">
                                        Belum ada data
                                    </span>{" "}
                                    😕
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, idx) => (
                                <tr key={idx} className="border-t">
                                    {columns.map((col) => (
                                        <td
                                            key={col.accessor}
                                            className="px-4 py-2"
                                        >
                                            {col.Cell
                                                ? col.Cell({
                                                      row,
                                                      rowIndex: idx,
                                                      globalIndex:
                                                          (currentPage - 1) *
                                                              entriesPerPage +
                                                          idx +
                                                          1,
                                                  })
                                                : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
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

import { useState, useEffect, useMemo } from "react";

export default function PembelianKreditTable({
    data: rawInput,
    akunOptions = [],
    onAddTransaksi = () => console.log("tambah"),
}) {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAkun, setSelectedAkun] = useState("");

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

    // Filter akun dan search
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const matchAkun =
                !selectedAkun ||
                row.account_type?.toLowerCase() === selectedAkun.toLowerCase();
            const matchSearch =
                row.sub_ledger
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                row.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.transaction_date
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchAkun && matchSearch;
        });
    }, [data, selectedAkun, searchTerm]);

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex justify-between items-center">
                {/* Filter akun */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700">
                        Filter akun:
                    </label>
                    <select
                        value={selectedAkun}
                        onChange={(e) => setSelectedAkun(e.target.value)}
                        className="border rounded px-3 py-1 text-sm"
                    >
                        <option value="">Semua</option>
                        {akunOptions.map((akun) => (
                            <option key={akun} value={akun}>
                                {akun}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search + Tambah */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onAddTransaksi()}
                        className="flex items-center bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    >
                        <span className="mr-2">Tambah transaksi</span>
                        <span className="text-lg font-bold">+</span>
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded px-3 py-1 text-sm w-60"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100 text-left text-sm text-gray-700">
                        <tr>
                            <th className="px-4 py-2 w-12">No.</th>
                            <th className="px-4 py-2 w-32">Tanggal</th>
                            <th className="px-4 py-2">Nama Akun</th>
                            <th className="px-4 py-2">Barang</th>
                            <th className="px-4 py-2 text-right">
                                Total Pembelian
                            </th>
                            <th className="px-4 py-2">Vendor</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-gray-500"
                                >
                                    <span className="italic">
                                        Tidak ada data
                                    </span>{" "}
                                    😕
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-t ${
                                        idx % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    } hover:bg-blue-50`}
                                >
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">
                                        {row.transaction_date}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.account_type}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.sub_ledger ?? "-"}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {row.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.vendor ?? "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { useState, useEffect, useMemo } from "react";
import TransaksiPembelianPopup from "./TransaksiPembelianPopup";
import { useForm } from "@inertiajs/react";

export default function TabelTransaksiPembelian({
    data: rawInput,
    akunOptions = [],
    subLedgers = [],
    setSubLedgers,
    vendors = [],
    source = [],
    setVendors,
    setSources,
    actionEdit,
    transaction_type,
    actionDelete,
    onAddTransaksi = () => {},
}) {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAkun, setSelectedAkun] = useState("");
    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    // format tanggal
    const formatTanggal = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Form untuk delete
    const { delete: destroy } = useForm();

    const handleDeleteSubmit = () => {
        destroy(route(actionDelete, { id: deleteData.id }));
        setDeleteData(null);
    };

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
                            <th className="px-4 py-2">Keterangan</th>
                            <th className="px-4 py-2">Qty</th>
                            <th className="px-4 py-2 text-right">
                                Total Pembelian
                            </th>
                            <th className="px-4 py-2">
                                {transaction_type == "kredit"
                                    ? "Vendor"
                                    : "Sumber"}
                            </th>
                            <th className="px-4 py-2 text-center">Aksi</th>
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
                                        {formatTanggal(row.transaction_date)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.account_type}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.sub_ledger ?? "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.description}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.quantity}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {row.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {transaction_type == "kredit"
                                            ? row.vendor ?? "-"
                                            : row.source ?? "-"}
                                    </td>
                                    <td className="px-4 py-2 text-center space-x-2">
                                        <button
                                            onClick={() => setEditData(row)}
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium 
               text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteData(row)}
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium 
               text-white bg-red-600 rounded hover:bg-red-700 transition"
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {editData && (
                <TransaksiPembelianPopup
                    title="Edit Transaksi"
                    action={actionEdit}
                    buttonType="Edit"
                    akunOptions={akunOptions}
                    subLedgers={subLedgers}
                    vendors={vendors}
                    source={source}
                    show={editData}
                    onClose={() => setEditData(null)}
                    onAddSubLedger={(newItem) =>
                        setSubLedgers([...subLedgers, newItem.name])
                    }
                    onAddVendor={(newVendor) =>
                        setVendors([...vendors, newVendor])
                    }
                    onAddSource={(newSource) =>
                        setSources([...source, newSource])
                    }
                    initialData={editData}
                    transaction_type={transaction_type}
                    isEdit={true}
                />
            )}
            {deleteData && (
                <div>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setDeleteData(null)}
                    />
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white rounded-[10px] shadow-2xl z-50 w-[400px] max-w-full p-4 space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-red-600">
                            Hapus Transaksi?
                        </h3>
                        <p className="text-sm text-gray-700">
                            Anda yakin ingin menghapus transaksi{" "}
                            <strong>{deleteData.sub_ledger}</strong> dari vendor{" "}
                            <strong>
                                {transaction_type == "kredit"
                                    ? deleteData.vendor
                                    : deleteData.source}
                            </strong>
                            ?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDeleteData(null)}
                                className="px-4 py-1 border rounded text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteSubmit}
                                className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

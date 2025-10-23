import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function TransaksiPopup({
    title,
    action,
    buttonType,
    akunOptions,
    subLedgers = [],
    vendors = [],
    show,
    initialData,
    onClose,
    onAddSubLedger,
    onAddVendor,
    isEdit = false,
}) {
    const [showBarangPopup, setShowBarangPopup] = useState(false);
    const [showVendorPopup, setShowVendorPopup] = useState(false);

    const { data, setData, post, put, processing } = useForm({
        id: "",
        account: "",
        sub_ledger: "",
        amount: "",
        vendor: "",
        transaction_date: new Date().toISOString().slice(0, 16),
        description: "Pembelian kredit",
    });

    useEffect(() => {
        if (initialData) {
            setData({
                id: initialData.id ?? "",
                account: initialData.account_type ?? "",
                sub_ledger: initialData.sub_ledger ?? "",
                amount: initialData.total ?? "",
                vendor: initialData.vendor ?? "",
                transaction_date: initialData.transaction_date ?? "",
                description: initialData.description ?? "Pembelian kredit",
            });
        }
    }, [initialData]);

    const handleSubmit = () => {
        // Validasi wajib
        if (!data.account || !data.amount) {
            alert("Akun dan jumlah wajib diisi.");
            return;
        }

        // Validasi opsional yang aktif
        if (subLedgers.length > 0 && !data.sub_ledger) {
            alert("Jenis barang wajib dipilih.");
            return;
        }

        if (vendors.length > 0 && !data.vendor) {
            alert("Vendor wajib dipilih.");
            return;
        }

        if (!data.transaction_date) {
            alert("Waktu transaksi wajib diisi.");
            return;
        }

        if (isEdit) {
            put(route(action, { id: data.id }), {
                onSuccess: () => {
                    onClose(); // ← Tutup pop-up
                },
                onError: () => {
                    onClose();
                },
            });
        } else {
            post(action, {
                onSuccess: () => {
                    onClose(); // ← Tutup pop-up
                    setData({
                        id: "",
                        account: "",
                        sub_ledger: "",
                        amount: "",
                        vendor: "",
                        transaction_date: new Date().toISOString().slice(0, 16),
                        description: "Pembelian kredit",
                    });
                },
            });
        }
    };

    return (
        <div className={show ? "inline-block" : "hidden"}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Main Popup */}
            <div className="overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[5px] shadow-lg z-50 w-[500px] max-w-full">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Akun */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">
                            Nama Akun <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.account}
                            onChange={(e) => setData("account", e.target.value)}
                            className="border rounded px-3 py-1 w-full"
                            required
                        >
                            <option value="">Pilih akun</option>
                            {akunOptions.map((akun) => (
                                <option key={akun} value={akun}>
                                    {akun}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subledger (opsional) */}
                    {subLedgers.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-sm text-gray-700">
                                Jenis Barang{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={data.sub_ledger}
                                    onChange={(e) =>
                                        setData("sub_ledger", e.target.value)
                                    }
                                    className="border rounded px-3 py-1 w-full"
                                >
                                    <option value="">Pilih jenis barang</option>
                                    {subLedgers.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setShowBarangPopup(true)}
                                    className="min-w-fit bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                >
                                    + Barang
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Jumlah */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">
                            Jumlah Pembelian{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData("amount", e.target.value)}
                            placeholder="Masukkan jumlah"
                            className="border rounded px-3 py-1 w-full"
                            required
                        />
                    </div>

                    {/* Vendor (opsional) */}
                    {vendors.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-sm text-gray-700">
                                Vendor <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={data.vendor}
                                    onChange={(e) =>
                                        setData("vendor", e.target.value)
                                    }
                                    className="border rounded px-3 py-1 w-full"
                                >
                                    <option value="">Pilih vendor</option>
                                    {vendors.map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setShowVendorPopup(true)}
                                    className="min-w-fit bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                >
                                    + Vendor
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Deskripsi transaksi */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">
                            Deskripsi Transaksi{" "}
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            placeholder="Contoh: Pembelian mesin jahit untuk produksi"
                            className="border rounded px-3 py-2 w-full resize-none"
                        />
                    </div>

                    {/* Tanggal transaksi */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">
                            Tanggal & Jam Transaksi{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={data.transaction_date}
                            onChange={(e) =>
                                setData("transaction_date", e.target.value)
                            }
                            className="border rounded px-3 py-1 w-full"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        {processing
                            ? "Menyimpan......"
                            : buttonType + "Transaksi"}
                    </button>
                </div>
            </div>

            {/* Pop-up Tambah Barang */}
            {showBarangPopup && (
                <BarangPopup
                    onClose={() => setShowBarangPopup(false)}
                    onAdd={onAddSubLedger}
                    akunOptions={akunOptions}
                />
            )}

            {/* Pop-up Tambah Vendor */}
            {showVendorPopup && (
                <VendorPopup
                    onClose={() => setShowVendorPopup(false)}
                    onAdd={onAddVendor}
                />
            )}
        </div>
    );
}

// Subkomponen Tambah Barang
function BarangPopup({ onClose, onAdd, akunOptions }) {
    const [namaBarang, setNamaBarang] = useState("");
    const [akun, setAkun] = useState("");

    const handleAdd = () => {
        if (!namaBarang.trim()) {
            alert("Nama barang wajib diisi.");
            return;
        }
        if (!akun) {
            alert("Akun barang wajib dipilih.");
            return;
        }
        onAdd({ name: namaBarang.trim(), account: akun });
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[10px] shadow-2xl z-50 w-[400px] max-w-full p-4 space-y-4">
                <h3 className="text-lg font-semibold">Tambah Barang</h3>
                <input
                    type="text"
                    placeholder="Nama barang"
                    value={namaBarang}
                    onChange={(e) => setNamaBarang(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                />
                <select
                    value={akun}
                    onChange={(e) => setAkun(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                >
                    <option value="">Pilih akun</option>
                    {akunOptions.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Tambah Barang
                </button>
            </div>
        </>
    );
}

// Subkomponen Tambah Vendor
function VendorPopup({ onClose, onAdd }) {
    const [namaVendor, setNamaVendor] = useState("");

    const handleAdd = () => {
        if (!namaVendor.trim()) {
            alert("Nama vendor wajib diisi.");
            return;
        }
        onAdd(namaVendor.trim());
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[10px] shadow-2xl z-50 w-[400px] max-w-full p-4 space-y-4">
                <h3 className="text-lg font-semibold">Tambah Vendor</h3>
                <input
                    type="text"
                    placeholder="Nama vendor"
                    value={namaVendor}
                    onChange={(e) => setNamaVendor(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                />
                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Tambah Vendor
                </button>
            </div>
        </>
    );
}

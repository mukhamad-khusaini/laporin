import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useMemo } from "react";
import TableCore from "../utils/table/TableCore";
import TableHead from "../utils/table/TableHead";
import TableBody from "../utils/table/TableBody";
import { usePage } from "@inertiajs/react";
import { formatTanggal, formatRupiah } from "@/function";
import PopupCore from "../utils/popup/PopupCore";
import InputAkun from "../utils/popup/inputs/InputAkun";
import { useForm } from "@inertiajs/react";
import InputSubLedger from "../utils/popup/inputs/InputSubLedger";

export default function PenjualanKredit() {
    const { data: dataStream, account_options, sub_ledgers } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [addPopup, setAddPopup] = useState(false);
    const [editPopup, setEditPopup] = useState(false);

    // Form Tambah transaksi
    const {
        data: dataTambah,
        setData: setDataTambah,
        post,
        processing,
    } = useForm({
        account_type: "",
        sub_ledger: "",
        amount: "",
        receivable: "",
        transaction_date: new Date().toISOString().slice(0, 16),
        description: "",
    });

    const hendleSearch = (sch_tx) => {
        setSearchTerm(sch_tx);
    };

    const hendleAddPopup = () => {
        setAddPopup(!addPopup);
    };

    const hendleEditPopup = () => {
        setEditPopup(!editPopup);
    };

    const columns = [
        "No.",
        "Tanggal",
        "Akun",
        "Barang",
        "Keterangan",
        "Total",
        "Piutang",
        "Aksi",
    ];

    const filteredData = useMemo(() => {
        return dataStream.filter((row) => {
            const matchSearch =
                row.sub_ledger
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                row.piutang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.transaction_date
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchSearch;
        });
    }, [dataStream, searchTerm]);

    return (
        <AuthenticatedLayout title="Penjualan Kredit">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Penjualan Kredit
            </h2>
            <div className="px-6 py-3">
                {/* Popup hendler */}
                <PopupCore onClose={hendleAddPopup} isOpen={addPopup}>
                    <InputAkun
                        options={account_options}
                        data={dataTambah}
                        setData={setDataTambah}
                    />
                    <InputSubLedger
                        options={sub_ledgers}
                        data={dataTambah}
                        setData={setDataTambah}
                    />
                </PopupCore>

                {/* Table hendler */}
                <TableCore onAdd={hendleAddPopup} onSearch={hendleSearch}>
                    <TableHead columns={columns} />
                    <TableBody
                        data={filteredData}
                        renderRow={function (item, idx) {
                            return (
                                <>
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">
                                        {formatTanggal(item.transaction_date)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.account_type}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.sub_ledger}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.description}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatRupiah(item.amount)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.piutang}
                                    </td>
                                    <td className="px-4 py-2">
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
                                </>
                            );
                        }}
                    />
                </TableCore>
            </div>
        </AuthenticatedLayout>
    );
}

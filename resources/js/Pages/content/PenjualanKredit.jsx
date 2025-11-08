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
import InputJumlah from "../utils/popup/inputs/InputJumlah";
import InputKeterangan from "../utils/popup/inputs/InputKeterangan";
import InputTanggal from "../utils/popup/inputs/InputTanggal";
import DeletePopup from "../utils/popup/DeletePopup";

export default function PenjualanKredit() {
    // Get page props
    //
    //
    //
    const {
        data: dataStream,
        account_options,
        sub_ledgers,
        receivables,
    } = usePage().props;

    // Variable declarations
    //
    //
    //
    const [searchTerm, setSearchTerm] = useState("");
    const [addPopup, setAddPopup] = useState(false);
    const [editPopup, setEditPopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    // Sub ledgers options
    //
    //
    //
    //
    const [sub_ledger_options, set_sub_ledger_options] = useState(sub_ledgers);

    const [receivable_sub_ledger_options, set_receivable_sub_ledger_options] =
        useState(receivables);
    const hendleAddReceivableSubLedger = (e) => {
        set_receivable_sub_ledger_options([
            ...receivable_sub_ledger_options,
            e.name,
        ]);
    };

    // Form Tambah transaksi
    //
    //
    //
    //
    //
    const {
        data: dataTambah,
        setData: setDataTambah,
        post: tambahPost,
        processing: tambahProcessing,
    } = useForm({
        account_type: "",
        sub_ledger: "",
        amount: "",
        receivable: "",
        transaction_date: new Date().toISOString().slice(0, 16),
        description: "",
    });

    //
    //
    // Hendle form add
    //
    //
    const hendleAddSetValue_accountType = (e) => {
        setDataTambah("account_type", e);
    };

    const hendleAddSetValue_subLedger = (e) => {
        setDataTambah("sub_ledger", e);
    };

    const hendleAddSetValue_receivable = (e) => {
        setDataTambah("receivable", e);
    };

    const hendleAddSetValue_amount = (e) => {
        setDataTambah("amount", e);
    };

    const hendleAddSetValue_description = (e) => {
        setDataTambah("description", e);
    };

    const hendleAddSetValue_transaction_date = (e) => {
        setDataTambah("transaction_date", e);
    };

    const hendleAddSubmit = () => {
        // Validasi wajib
        if (!dataTambah.account_type || !dataTambah.amount) {
            alert("Akun dan jumlah wajib diisi.");
            return;
        }

        if (!dataTambah.sub_ledger) {
            alert("Jenis barang wajib dipilih.");
            return;
        }

        if (!dataTambah.receivable) {
            alert("Piutang wajib dipilih.");
            return;
        }

        if (!dataTambah.transaction_date) {
            alert("Waktu transaksi wajib diisi.");
            return;
        }

        tambahPost(route("penjualan-kredit.store"));
    };

    // Form Edit transaksi
    //
    //
    //
    //
    //
    const {
        data: dataEdit,
        setData: setDataEdit,
        post: editPost,
        processing: editProcessing,
    } = useForm({
        account_type: "",
        sub_ledger: "",
        amount: "",
        receivable: "",
        transaction_date: new Date().toISOString().slice(0, 16),
        description: "",
    });

    //
    //
    // Hendle form edit
    //
    //
    const hendleEditSetValue_accountType = (e) => {
        setDataEdit("account_type", e);
    };

    const hendleEditSetValue_subLedger = (e) => {
        setDataEdit("sub_ledger", e);
    };

    const hendleEditSetValue_receivable = (e) => {
        setDataEdit("receivable", e);
    };

    const hendleEditSetValue_amount = (e) => {
        setDataEdit("amount", e);
    };

    const hendleEditSetValue_description = (e) => {
        setDataEdit("description", e);
    };

    const hendleEditSetValue_transaction_date = (e) => {
        setDataEdit("transaction_date", e);
    };

    const hendleEditSubmit = () => {
        // Validasi wajib
        if (!dataTambah.account_type || !dataTambah.amount) {
            alert("Akun dan jumlah wajib diisi.");
            return;
        }

        if (!dataTambah.sub_ledger) {
            alert("Jenis barang wajib dipilih.");
            return;
        }

        if (!dataTambah.receivable) {
            alert("Piutang wajib dipilih.");
            return;
        }

        if (!dataTambah.transaction_date) {
            alert("Waktu transaksi wajib diisi.");
            return;
        }
    };

    // Form Delete
    //
    //
    //
    //
    const {
        data: dataDelete,
        setData: setDataDelete,
        delete: destroy,
    } = useForm({
        id: "",
    });

    // Hendler form delete
    //
    //
    //
    //
    const hendleDeleteSetValue_id = (item) => {
        setDataDelete({ id: item.id });
    };

    const onDelete = () => {
        destroy(route("penjualan-kredit.destroy", { id: dataDelete.id }));
    };

    //
    //
    // Hendler table
    //
    //
    const hendleSearch = (sch_tx) => {
        setSearchTerm(sch_tx);
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

    // Hendler popup tambah
    //
    //
    //
    //
    const hendleAddPopup = () => {
        setAddPopup(!addPopup);
    };

    // Hendler popup edit
    //
    //
    //
    //
    const hendleEditPopup = (item) => {
        if (item) {
            hendleEditSetValue_accountType(item.account_type);
            hendleEditSetValue_subLedger(item.sub_ledger);
            hendleEditSetValue_receivable(item.receivable);
            hendleEditSetValue_amount(item.amount);
            hendleEditSetValue_description(item.description);
            hendleEditSetValue_transaction_date(item.transaction_date);
        }
        setEditPopup(!editPopup);
    };

    // Hendler popup delete
    //
    //
    //
    //
    const hendleDeletePopup = (item) => {
        if (item) {
            hendleDeleteSetValue_id(item);
        }
        setDeletePopup(!deletePopup);
    };

    // Data filter
    //
    //
    //
    //
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
                {/*  
                #
                #
                # Popup Add hendler
                #
                #
                */}
                <PopupCore
                    onClose={hendleAddPopup}
                    isOpen={addPopup}
                    onSubmit={hendleAddSubmit}
                    status="Tambah"
                    isProcessing={tambahProcessing}
                >
                    <InputAkun
                        options={account_options}
                        value={dataTambah.account_type}
                        hendleSetvalue={hendleAddSetValue_accountType}
                    />
                    <InputSubLedger
                        options={sub_ledger_options}
                        value={dataTambah.sub_ledger}
                        hendleSetValue={hendleAddSetValue_subLedger}
                        name="Sub"
                    />
                    <InputSubLedger
                        options={receivable_sub_ledger_options}
                        value={dataTambah.receivable}
                        hendleSetValue={hendleAddSetValue_receivable}
                        onAdd={hendleAddReceivableSubLedger}
                        name="Piutang"
                    />
                    <InputJumlah
                        value={dataTambah.amount}
                        hendleSetValue={hendleAddSetValue_amount}
                        name="Penjualan"
                    />
                    <InputKeterangan
                        value={dataTambah.description}
                        hendleSetValue={hendleAddSetValue_description}
                    />
                    <InputTanggal
                        value={dataTambah.transaction_date}
                        hendleSetValue={hendleAddSetValue_transaction_date}
                    />
                </PopupCore>

                {/* 
                #
                #
                # Table hendler 
                #
                #
                */}
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
                                            onClick={() =>
                                                hendleEditPopup(item)
                                            }
                                            className="inline-flex items-center px-3 py-1 text-sm font-medium 
               text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                hendleDeletePopup(item)
                                            }
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
                {/*  
                #
                #
                # Popup Edit hendler
                #
                #
                */}
                <PopupCore
                    onClose={hendleEditPopup}
                    isOpen={editPopup}
                    onSubmit={hendleAddSubmit}
                    status="Edit"
                >
                    <InputAkun
                        options={account_options}
                        value={dataEdit.account_type}
                        hendleSetvalue={hendleEditSetValue_accountType}
                    />
                    <InputSubLedger
                        options={sub_ledger_options}
                        value={dataEdit.sub_ledger}
                        hendleSetValue={hendleEditSetValue_subLedger}
                        name="Sub"
                    />
                    <InputSubLedger
                        options={receivable_sub_ledger_options}
                        value={dataEdit.receivable}
                        hendleSetValue={hendleEditSetValue_receivable}
                        onAdd={hendleAddReceivableSubLedger}
                        name="Piutang"
                    />
                    <InputJumlah
                        value={dataEdit.amount}
                        hendleSetValue={hendleEditSetValue_amount}
                        name="Penjualan"
                    />
                    <InputKeterangan
                        value={dataEdit.description}
                        hendleSetValue={hendleEditSetValue_description}
                    />
                    <InputTanggal
                        value={dataEdit.transaction_date}
                        hendleSetValue={hendleEditSetValue_transaction_date}
                    />
                </PopupCore>

                {/* 
                #
                #
                # Delete popup
                #
                #
                #
                */}
                <DeletePopup
                    show={deletePopup}
                    onClose={hendleDeletePopup}
                    onDelete={onDelete}
                />
            </div>
        </AuthenticatedLayout>
    );
}

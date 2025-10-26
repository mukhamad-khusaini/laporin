import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useMemo } from "react";
import TableCore from "../utils/table/TableCore";
import TableHead from "../utils/table/TableHead";
import TableBody from "../utils/table/TableBody";
import { usePage } from "@inertiajs/react";

export default function PenjualanKredit() {
    const { data } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");

    const hendleSearch = (sch_tx) => {
        setSearchTerm(sch_tx);
    };

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

    // Format rupiah
    const formatRupiah = (angka) => {
        if (angka == null || isNaN(angka)) return "Rp0";

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
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
        return data.filter((row) => {
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
    }, [data, searchTerm]);

    return (
        <AuthenticatedLayout title="Penjualan Kredit">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Penjualan Kredit
            </h2>
            <div className="px-6 py-3">
                <TableCore onSearch={hendleSearch}>
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
                                    <td className="px-4 py-2">Aksi</td>
                                </>
                            );
                        }}
                    />
                </TableCore>
            </div>
        </AuthenticatedLayout>
    );
}

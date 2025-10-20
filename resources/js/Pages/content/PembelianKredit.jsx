import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TailwindTable from "../utils/TailwindTable";
import TransactionTable from "../utils/TransactionTable";

export default function PembelianKredit({ data }) {
    console.log(data.original);

    const columns = [
        {
            header: "No.",
            accessor: "no",
            Cell: ({ globalIndex }) => globalIndex,
        },
        { header: "Tanggal", accessor: "transaction_date" },
        { header: "Akun", accessor: "account" },
        { header: "Debit", accessor: "debit" },
        { header: "Kredit", accessor: "credit" },
        { header: "Sub", accessor: "sub_ledger" },
        { header: "Keterangan", accessor: "description" },
    ];

    return (
        <AuthenticatedLayout title="Pembelian Kredit">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Pembelian Kredit
            </h2>
            <div className="px-6 py-3">
                <TransactionTable data={data.original} />
            </div>
        </AuthenticatedLayout>
    );
}

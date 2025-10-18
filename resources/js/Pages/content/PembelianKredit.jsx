import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TailwindTable from "../utils/TailwindTable";

export default function PembelianKredit() {
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Office", accessor: "office" },
        { header: "Extn.", accessor: "extn" },
        { header: "Start Date", accessor: "start_date" },
        { header: "Salary", accessor: "salary" },
    ];

    return (
        <AuthenticatedLayout title="Pembelian Kredit">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Pembelian Kredit
            </h2>
            <div className="px-6 py-3">
                <TailwindTable
                    transaksi="Pembelian"
                    columns={columns}
                    data="./data.json"
                />
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TailwindTable from "../utils/TailwindTable";

export default function Pembelian() {
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Office", accessor: "office" },
        { header: "Extn.", accessor: "extn" },
        { header: "Start Date", accessor: "start_date" },
        { header: "Salary", accessor: "salary" },
    ];

    return (
        <AuthenticatedLayout title="Pembelian">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">Pembelian</h2>
            <div className="px-6 py-3">
                <TailwindTable columns={columns} jsonUrl="./data.json" />
            </div>
        </AuthenticatedLayout>
    );
}

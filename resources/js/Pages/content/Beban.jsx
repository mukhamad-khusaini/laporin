import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TailwindTable from "../utils/TailwindTable";

export default function Beban() {
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Office", accessor: "office" },
        { header: "Extn.", accessor: "extn" },
        { header: "Start Date", accessor: "start_date" },
        { header: "Salary", accessor: "salary" },
    ];

    return (
        <AuthenticatedLayout title="Beban">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">Beban</h2>
            <div className="px-6 py-3">
                <TailwindTable
                    transaksi="Beban"
                    columns={columns}
                    data="./data.json"
                />
            </div>
        </AuthenticatedLayout>
    );
}

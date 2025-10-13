import AppLayout from "../layouts/App.Layouts";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";

DataTable.use(DT);

export default function Pembelian() {
    const columns = [
        { data: "name" },
        { data: "position" },
        { data: "office" },
        { data: "extn" },
        { data: "start_date" },
        { data: "salary" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Tagihan Pembelian</h2>
            <DataTable ajax="/data.json" columns={columns} className="display">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Extn.</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>
                </thead>
            </DataTable>
        </div>
    );
}

Pembelian.layout = (page) => <AppLayout children={page} />;

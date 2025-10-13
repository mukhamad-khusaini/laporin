import "../../css/app.css";
import AppLayout from "./layouts/App.Layouts";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";

DataTable.use(DT);

export default function Welcome() {
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
            {/* <div className="bg-white px-6 py-4">
                <h2 className="text-4xl font-bold">Dashboard</h2>
            </div>
            <div className=" bg-white px-6 py-3 flex flex-wrap gap-6 content-start">
                <div className="w-[20rem] h-[20rem] border border-black rounded-[10px] shadow-md p-4">
                    <h2 className="text-lg font-semibold">Lorem ipsum</h2>
                </div>
                <div className="w-[20rem] h-[20rem] border border-black rounded-[10px] shadow-md p-4">
                    <h2 className="text-lg font-semibold">Lorem ipsum</h2>
                </div>
                <div className="w-[20rem] h-[20rem] border border-black rounded-[10px] shadow-md p-4">
                    <h2 className="text-lg font-semibold">Lorem ipsum</h2>
                </div>
                <div className="w-[17rem] h-[10rem] border border-black rounded-[10px] shadow-md p-4">
                    <h2 className="text-lg font-semibold">Lorem ipsum</h2>
                </div>
                <div className="w-[10rem] h-[10rem] border border-black rounded-[10px] shadow-md p-4">
                    <h2 className="text-lg font-semibold">Lorem ipsum</h2>
                </div>
            </div> */}
            <h2 className="text-2xl font-bold mb-4 bg-white px-6 py-4">
                Tagihan Pembelian
            </h2>
            <div className="px-6 py-3">
                <DataTable
                    ajax="./data.json"
                    columns={columns}
                    className="display"
                >
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
        </div>
    );
}

Welcome.layout = (page) => <AppLayout children={page} />;

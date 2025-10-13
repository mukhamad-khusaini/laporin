import "../../css/app.css";
import AppLayout from "./layouts/App.Layouts";
import TailwindTable from "./utils/TailwindTable";

export default function Welcome() {
    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Office", accessor: "office" },
        { header: "Extn.", accessor: "extn" },
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
                <TailwindTable columns={columns} jsonUrl="/data.json" />
            </div>
        </div>
    );
}

Welcome.layout = (page) => <AppLayout children={page} />;

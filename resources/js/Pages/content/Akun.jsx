import TailwindTable from "../utils/TailwindTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Akun() {
    const columns = [
        { header: "No", accessor: "no" },
        { header: "Nama Akun", accessor: "nama" },
        { header: "Deskripsi", accessor: "deskripsi" },
        {
            header: "Aksi",
            accessor: "aksi",
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const data = [
        { no: 1, nama: "Kas", deskripsi: "Akun kas untuk transaksi tunai" },
        {
            no: 2,
            nama: "Piutang Usaha",
            deskripsi: "Akun piutang dari pelanggan",
        },
        {
            no: 3,
            nama: "Persediaan",
            deskripsi: "Akun barang dagang yang tersedia",
        },
        { no: 4, nama: "Modal", deskripsi: "Akun modal pemilik usaha" },
    ];

    const handleEdit = (row) => {
        console.log("Edit akun:", row);
        // Tambahkan navigasi atau modal edit
    };

    const handleDelete = (row) => {
        console.log("Delete akun:", row);
        // Tambahkan konfirmasi dan aksi delete
    };

    return (
        <AuthenticatedLayout>
            <Head title="Akun" />
            <div className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Akun</h2>
                <TailwindTable columns={columns} data={data} />
            </div>
        </AuthenticatedLayout>
    );
}

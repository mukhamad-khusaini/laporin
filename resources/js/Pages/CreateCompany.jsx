import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function CreateCompany() {
    const [jenisUsaha, setJenisUsaha] = useState("");

    const akunDasar = [
        "Kas",
        "Utang",
        "Modal",
        "Beban",
        "Peralatan",
        "Perlengkapan",
    ];
    const akunTambahan = {
        jasa: ["Pendapatan"],
        dagang: ["Penjualan"],
        manufaktur: ["Penjualan", "Bahan Baku"],
    };

    const getAkunList = () => {
        const tambahan = akunTambahan[jenisUsaha] || [];
        return [...akunDasar, ...tambahan];
    };

    const { data, setData, post, processing, errors } = useForm({
        nama_usaha: "",
        jenis_usaha: "",
        akun_default: getAkunList(),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/create-company");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg w-[90vw] max-w-3xl p-6 space-y-6"
            >
                {/* Gambar */}
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                        src="/img/laporin.png"
                        alt="Preview Aplikasi"
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Nama Usaha & Jenis */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Usaha
                        </label>
                        <input
                            type="text"
                            name="nama_usaha"
                            value={data.nama_usaha}
                            onChange={(e) =>
                                setData("nama_usaha", e.target.value)
                            }
                            required
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                        {errors.nama_usaha && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.nama_usaha}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Jenis Usaha
                        </label>
                        <select
                            name="jenis_usaha"
                            value={data.jenis_usaha}
                            onChange={(e) => {
                                setJenisUsaha(e.target.value);
                                setData("jenis_usaha", e.target.value);
                                setData("akun_default", [
                                    ...akunDasar,
                                    ...(akunTambahan[e.target.value] || []),
                                ]);
                            }}
                            required
                            className="mt-1 block w-full border rounded px-3 py-2"
                        >
                            <option value="">-- Pilih Jenis Usaha --</option>
                            <option value="jasa">Jasa</option>
                            <option value="dagang">Dagang</option>
                            <option value="manufaktur">Manufaktur</option>
                        </select>
                        {errors.jenis_usaha && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.jenis_usaha}
                            </div>
                        )}
                    </div>
                </div>

                {/* Akun Default */}
                {jenisUsaha && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Akun Default
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {getAkunList().map((akun) => (
                                <label
                                    key={akun}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        name="akun_default[]"
                                        value={akun}
                                        checked
                                        disabled
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {akun}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tombol Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {processing ? "Menyimpan..." : "Create Company"}
                </button>
            </form>
        </div>
    );
}

// import { useState } from "react";

// export default function CreateCompany() {
//     const [jenisUsaha, setJenisUsaha] = useState("");

//     const akunDasar = [
//         "Kas",
//         "Utang",
//         "Modal",
//         "Beban",
//         "Peralatan",
//         "Perlengkapan",
//     ];
//     const akunTambahan = {
//         jasa: ["Pendapatan"],
//         dagang: ["Penjualan"],
//         manufaktur: ["Penjualan", "Bahan Baku"],
//     };

//     const getAkunList = () => {
//         const tambahan = akunTambahan[jenisUsaha] || [];
//         return [...akunDasar, ...tambahan];
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//             <form
//                 method="post"
//                 action="/create-company"
//                 className="bg-white rounded-xl shadow-lg w-[90vw] max-w-3xl p-6 space-y-6"
//             >
//                 {/* Gambar */}
//                 <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
//                     <img
//                         src="/img/laporin.png"
//                         alt="Preview Aplikasi"
//                         className="object-cover rounded-lg"
//                     />
//                 </div>
//                 {/* Nama Usaha & Jenis */}
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Nama Usaha
//                         </label>
//                         <input
//                             type="text"
//                             name="nama_usaha"
//                             required
//                             className="mt-1 block w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Jenis Usaha
//                         </label>
//                         <select
//                             name="jenis_usaha"
//                             value={jenisUsaha}
//                             onChange={(e) => setJenisUsaha(e.target.value)}
//                             required
//                             className="mt-1 block w-full border rounded px-3 py-2"
//                         >
//                             <option value="">-- Pilih Jenis Usaha --</option>
//                             <option value="jasa">Jasa</option>
//                             <option value="dagang">Dagang</option>
//                             <option value="manufaktur">Manufaktur</option>
//                         </select>
//                     </div>
//                 </div>
//                 {/* Akun Default */}
//                 {jenisUsaha && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Akun Default
//                         </label>
//                         <div className="grid grid-cols-2 gap-2">
//                             {getAkunList().map((akun) => (
//                                 <label
//                                     key={akun}
//                                     className="flex items-center space-x-2"
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         name="akun_default[]"
//                                         value={akun}
//                                         checked
//                                         disabled
//                                         className="rounded"
//                                     />
//                                     <span className="text-sm text-gray-700">
//                                         {akun}
//                                     </span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//                 {/* Tombol Submit */}
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//                 >
//                     Create Company
//                 </button>
//             </form>
//         </div>
//     );
// }

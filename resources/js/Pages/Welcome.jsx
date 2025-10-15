import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg flex w-[80vw] max-w-5xl overflow-hidden">
                    {/* Kiri: Aksi */}
                    <div className="w-1/2 p-10 flex flex-col justify-center items-start space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Selamat Datang di Laporin
                        </h2>
                        <p className="text-gray-600">
                            Catat seluruh transaksi usaha anda dan rasakan
                            perbedaannya
                        </p>

                        <a
                            href="/login"
                            className="w-full text-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Login
                        </a>

                        <a
                            href="/register"
                            className="w-full text-center bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Sign In
                        </a>
                    </div>

                    {/* Kanan: Gambar */}
                    <div className="w-1/2 bg-gray-200 flex items-center justify-center ">
                        <img
                            src="/img/laporin.png"
                            alt="Preview Aplikasi"
                            className="object-fill"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

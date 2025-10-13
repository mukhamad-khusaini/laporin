import { Link, usePage, router } from "@inertiajs/react";

export default function AppLayout({ children }) {
    const { props } = usePage();

    return (
        <div className="min-h-screen max-w-screen flex bg-gray-100">
            <header className="w-full h-16 bg-white flex items-center justify-between px-6 shadow-md border-b border-gray-200 fixed">
                <h1 className="text-xl font-bold text-gray-800">
                    Nama Usaha Anda
                </h1>

                <div className="flex items-center space-x-4">
                    <img
                        src="img/profile.png"
                        alt="Profil"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <span className="text-gray-700 font-medium">Mukhamad</span>
                </div>
            </header>
            <aside className="w-[15vw] bg-gray-800 p-4 flex flex-col space-y-4 mt-16">
                <div class="group">
                    <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Pembelian
                    </button>
                    <div class="hidden group-hover:flex flex-col ml-4 mt-1 space-y-1">
                        <button
                            onClick={() => router.visit("/pembelian/kredit")}
                            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded"
                        >
                            Transaksi Kredit
                        </button>
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Transaksi Tunai
                        </button>
                    </div>
                </div>

                <div class="group">
                    <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Penjualan
                    </button>
                    <div class="hidden group-hover:flex flex-col ml-4 mt-1 space-y-1">
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Transaksi Kredit
                        </button>
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Transaksi Tunai
                        </button>
                    </div>
                </div>

                <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                    Produksi
                </button>
                <div class="group">
                    <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Transaksi Kas
                    </button>
                    <div class="hidden group-hover:flex flex-col ml-4 mt-1 space-y-1">
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Modal
                        </button>
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Utang
                        </button>
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Prive
                        </button>
                        <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-left text-sm rounded">
                            Piutang
                        </button>
                    </div>
                </div>
                <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                    Akun
                </button>
                <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                    Penyesuaian
                </button>
                <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                    Vendor
                </button>
                <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                    Laporin
                </button>
            </aside>

            <main className="w-[85vw] mt-16">{children}</main>
        </div>
    );
}

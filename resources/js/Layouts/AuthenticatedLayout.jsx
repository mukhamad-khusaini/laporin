import { Link, usePage, router, Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

export default function AuthenticatedLayout({ title, children }) {
    const user = usePage().props.auth.user;
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Menu navigasi
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    };

    if (!user) {
        router.visit("/");
        return null;
    }

    // Tutup menu jika klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen max-w-screen flex bg-gray-100">
                <header className="w-screen bg-white shadow px-6 py-3 flex justify-between items-center fixed">
                    <div className="flex flex-row">
                        <img
                            src="/img/logo.ico"
                            alt="laporin"
                            className="w-8 aspect-square mr-3"
                        />
                        <h1 className="text-xl font-bold">
                            Laporin | Aplikasi UMKM
                        </h1>
                    </div>

                    {/* Profile Section */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <img
                                src="/img/profile.png"
                                alt="Profile"
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                            <span className="text-gray-700 font-medium">
                                {user.name}
                            </span>
                        </button>

                        {/* Pop-up Menu */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-32">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </header>
                <aside className="w-[15vw] bg-gray-800 p-4 flex flex-col space-y-4 mt-16">
                    <Link
                        href={route("dashboard")}
                        class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full"
                    >
                        Dashboard
                    </Link>
                    {/* Pembelian */}
                    <div>
                        <button
                            onClick={() => toggleMenu("pembelian")}
                            className="text-white w-full text-left px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Pembelian
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openMenu === "pembelian"
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <Link
                                href="/pembelian"
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Transaksi Kredit
                            </Link>
                            <Link
                                href="/pembelian/tunai"
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Transaksi Tunai
                            </Link>
                        </div>
                    </div>

                    {/* Penjualan */}
                    <div>
                        <button
                            onClick={() => toggleMenu("penjualan")}
                            className="text-white w-full text-left px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Penjualan
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openMenu === "penjualan"
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <Link
                                href="/penjualan/kredit"
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Transaksi Kredit
                            </Link>
                            <Link
                                href="/penjualan/tunai"
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Transaksi Tunai
                            </Link>
                        </div>
                    </div>

                    <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Produksi
                    </button>

                    {/* Transaksi Kas */}
                    <div>
                        <button
                            onClick={() => toggleMenu("kas")}
                            className="text-white w-full text-left px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Transaksi Kas
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openMenu === "kas"
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <Link
                                href=""
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Modal
                            </Link>
                            <Link
                                href=""
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Utang
                            </Link>
                            <Link
                                href=""
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Prive
                            </Link>
                            <Link
                                href=""
                                className="text-white block px-6 py-2 text-sm hover:bg-gray-700 bg-gray-900"
                            >
                                Piutang
                            </Link>
                        </div>
                    </div>
                    <Link
                        href={route("akun")}
                        class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full"
                    >
                        Akun
                    </Link>
                    <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Penyesuaian
                    </button>
                    <button class="text-white text-left bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Vendor
                    </button>
                    <button class="text-white text-left bg-blue-800 hover:bg-gray-600 py-2 px-4 rounded w-full">
                        Laporin
                    </button>
                </aside>

                <main className="w-[85vw] mt-16">{children}</main>
            </div>
        </>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TransactionTable from "../utils/TransactionTable";
import { useState } from "react";
import TransaksiPopup from "../utils/TransaksiPopup";

export default function PembelianKredit({ data }) {
    const [popup, setPopup] = useState(false);
    const [subLedgers, setSubLedgers] = useState(["Mesin Jahit", "Kain Katun"]);
    const [vendors, setVendors] = useState([
        "CV Maju Jaya",
        "Toko Sumber Rejeki",
    ]);

    function popupHendler(state) {
        setPopup(state);
    }

    const akunOptions = Array.from(
        new Set(data.map((item) => item.account_type))
    ).filter(Boolean);

    return (
        <AuthenticatedLayout title="Pembelian Kredit">
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Pembelian Kredit
            </h2>
            <div className="px-6 py-3">
                <TransactionTable
                    akunOptions={akunOptions}
                    data={data}
                    onAddTransaksi={() => popupHendler(true)}
                />
            </div>

            <TransaksiPopup
                title="Transaksi Pembelian Kredit"
                akunOptions={["Peralatan", "Bahan Baku"]}
                subLedgers={subLedgers}
                vendors={vendors}
                show={popup}
                onClose={() => popupHendler(false)}
                onAddSubLedger={(newItem) =>
                    setSubLedgers([...subLedgers, newItem.name])
                }
                onAddVendor={(newVendor) => setVendors([...vendors, newVendor])}
            />
        </AuthenticatedLayout>
    );
}

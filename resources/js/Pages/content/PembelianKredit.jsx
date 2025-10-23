import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TransactionTable from "../utils/TransactionTable";
import { useState } from "react";
import TransaksiPopup from "../utils/TransaksiPopup";
import FlashMessage from "../utils/FlashMessage";

export default function PembelianKredit({ data, sub_ledgers, vendors }) {
    const [popup, setPopup] = useState(false);
    const [subLedgers, setSubLedgers] = useState(sub_ledgers);
    const [vendorNames, setVendorNames] = useState(vendors);

    console.log(sub_ledgers, vendors);

    function popupHendler(state) {
        setPopup(state);
    }

    const akunOptions = Array.from(
        new Set(data.map((item) => item.account_type))
    ).filter(Boolean);

    return (
        <AuthenticatedLayout title="Pembelian Kredit">
            <FlashMessage />
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Pembelian Kredit
            </h2>
            <div className="px-6 py-3">
                <TransactionTable
                    akunOptions={akunOptions}
                    actionEdit={"pembelian-kredit.update"}
                    actionDelete={"pembelian-kredit.destroy"}
                    subLedgers={subLedgers}
                    setSubLedgers={(data) => setSubLedgers(data)}
                    vendors={vendorNames}
                    setVendors={(data) => setVendorNames(data)}
                    data={data}
                    onAddTransaksi={() => popupHendler(true)}
                />
            </div>

            <TransaksiPopup
                title="Transaksi Pembelian Kredit"
                action="/pembelian-kredit"
                buttonType="Tambah"
                akunOptions={akunOptions}
                subLedgers={subLedgers}
                vendors={vendorNames}
                show={popup}
                onClose={() => popupHendler(false)}
                onAddSubLedger={(newItem) =>
                    setSubLedgers([...subLedgers, newItem.name])
                }
                onAddVendor={(newVendor) =>
                    setVendorNames([...vendorNames, newVendor])
                }
            />
        </AuthenticatedLayout>
    );
}

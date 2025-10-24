import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TransactionTable from "../utils/TransactionTable";
import { useState } from "react";
import TransaksiPopup from "../utils/TransaksiPopup";
import FlashMessage from "../utils/FlashMessage";

export default function PembelianKredit({
    data,
    sub_ledgers,
    vendors,
    account_options,
}) {
    const [popup, setPopup] = useState(false);
    const [subLedgers, setSubLedgers] = useState(sub_ledgers);
    const [vendorNames, setVendorNames] = useState(vendors);

    function popupHendler(state) {
        setPopup(state);
    }

    return (
        <AuthenticatedLayout title="Pembelian Kredit">
            <FlashMessage />
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Pembelian Kredit
            </h2>
            <div className="px-6 py-3">
                <TransactionTable
                    akunOptions={account_options}
                    actionEdit={"pembelian-kredit.update"}
                    actionDelete={"pembelian-kredit.destroy"}
                    subLedgers={subLedgers}
                    setSubLedgers={(data) => setSubLedgers(data)}
                    vendors={vendorNames}
                    setVendors={(data) => setVendorNames(data)}
                    transaction_type="kredit"
                    data={data}
                    onAddTransaksi={() => popupHendler(true)}
                />
            </div>

            <TransaksiPopup
                title="Transaksi Pembelian Kredit"
                action="/pembelian-kredit"
                buttonType="Tambah"
                akunOptions={account_options}
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
                transaction_type="kredit"
            />
        </AuthenticatedLayout>
    );
}

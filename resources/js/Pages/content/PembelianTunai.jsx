import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TabelTransaksiPembelian from "../utils/TabelTransaksiPembelian";
import { useState } from "react";
import TransaksiPembelianPopup from "../utils/TransaksiPembelianPopup";
import FlashMessage from "../utils/FlashMessage";

export default function PembelianTunai({
    data,
    sub_ledgers,
    source,
    account_options,
}) {
    const [popup, setPopup] = useState(false);
    const [subLedgers, setSubLedgers] = useState(sub_ledgers);
    const [sourceNames, setSourceNames] = useState(source);

    function popupHendler(state) {
        setPopup(state);
    }

    return (
        <AuthenticatedLayout title="Pembelian Tunai">
            <FlashMessage />
            <h2 className="text-2xl font-bold px-6 py-3 mb-4">
                Pembelian Tunai
            </h2>
            <div className="px-6 py-3">
                <TabelTransaksiPembelian
                    akunOptions={account_options}
                    actionEdit={"pembelian-tunai.update"}
                    actionDelete={"pembelian-tunai.destroy"}
                    subLedgers={subLedgers}
                    setSubLedgers={(data) => setSubLedgers(data)}
                    source={sourceNames}
                    setSources={(data) => setSourceNames(data)}
                    data={data}
                    onAddTransaksi={() => popupHendler(true)}
                    transaction_type="tunai"
                />
            </div>

            <TransaksiPembelianPopup
                title="Transaksi Pembelian Tunai"
                action="/pembelian-tunai"
                buttonType="Tambah"
                akunOptions={account_options}
                subLedgers={subLedgers}
                source={sourceNames}
                show={popup}
                onClose={() => popupHendler(false)}
                onAddSubLedger={(newItem) =>
                    setSubLedgers([...subLedgers, newItem.name])
                }
                onAddSource={(newSource) =>
                    setSourceNames([...sourceNames, newSource])
                }
            />
        </AuthenticatedLayout>
    );
}

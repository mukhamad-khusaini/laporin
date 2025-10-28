import React from "react";
import { useState } from "react";

function InputSubLedger({
    value,
    hendleSetValue,
    options,
    onAdd,
    name,
    account_options,
}) {
    const [addSubShow, setAddSubShow] = useState(false);

    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-700">
                {name} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
                <select
                    value={value}
                    onChange={(e) => hendleSetValue(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                >
                    <option value="">Pilih {name}</option>
                    {options.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                {onAdd && (
                    <>
                        <button
                            onClick={() => setAddSubShow(true)}
                            className="min-w-fit bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                            + {name}
                        </button>
                        <AddSubLedger
                            show={addSubShow}
                            onClose={() => setAddSubShow(false)}
                            onAdd={onAdd}
                            name={name}
                            account_options={account_options}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function AddSubLedger({ show, onClose, onAdd, name, account_options }) {
    const [subName, setSubName] = useState("");
    const [akun, setAkun] = useState("");

    const toTitleCase = (str) =>
        str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    const handleAdd = () => {
        if (!subName.trim()) {
            alert("Nama " + name + " wajib diisi.");
            return;
        }
        if (account_options && !akun) {
            alert("Akun " + name + " wajib dipilih.");
            return;
        }
        onAdd({ name: subName.trim(), account: akun });
        onClose();
    };

    return (
        show && (
            <>
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[10px] shadow-2xl z-50 w-[400px] max-w-full p-4 space-y-4">
                    <h3 className="text-lg font-semibold">Tambah {name}</h3>
                    <input
                        type="text"
                        placeholder={"Nama " + name}
                        value={subName}
                        onChange={(e) =>
                            setSubName(toTitleCase(e.target.value))
                        }
                        className="border rounded px-3 py-1 w-full"
                    />
                    {account_options && (
                        <select
                            value={akun}
                            onChange={(e) => setAkun(e.target.value)}
                            className="border rounded px-3 py-1 w-full"
                        >
                            <option value="">Pilih akun</option>
                            {account_options.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={handleAdd}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Tambah {name}
                    </button>
                </div>
            </>
        )
    );
}

export default InputSubLedger;

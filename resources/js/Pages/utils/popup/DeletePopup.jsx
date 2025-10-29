export default function DeletePopup({ show, onClose, onDelete }) {
    return (
        show && (
            <div>
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => onClose()}
                />
                <div
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
    bg-white rounded-[10px] shadow-2xl z-50 w-[400px] max-w-full p-4 space-y-4"
                >
                    <h3 className="text-lg font-semibold text-red-600">
                        Hapus Transaksi?
                    </h3>
                    <p className="text-sm text-gray-700">
                        Anda yakin ingin menghapus transaksi?
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => onClose()}
                            className="px-4 py-1 border rounded text-sm"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

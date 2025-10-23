import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const FlashMessage = () => {
    const { flash, errors } = usePage().props;
    const [message, setMessage] = useState(null);

    const [type, setType] = useState(null);

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType("success");
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        } else if (flash.error) {
            setMessage(flash.error);
            setType("error");
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        } else {
            setMessage(
                errors?.account ||
                    errors?.sub_ledger ||
                    errors?.amount ||
                    errors?.vendor ||
                    errors?.transaction_date ||
                    errors?.description
            );
            setType("error");
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash, errors]);

    const bg =
        type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";

    return (
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                message ? "max-h-20 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
            } ${bg} px-4 rounded mb-4 shadow`}
        >
            {message}
        </div>
    );
};

export default FlashMessage;

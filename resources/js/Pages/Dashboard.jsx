import AppLayout from "./layouts/App.Layouts";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <h2 className="px-6 py-2 font-bold text-2xl">Dashboard</h2>
        </AuthenticatedLayout>
    );
}

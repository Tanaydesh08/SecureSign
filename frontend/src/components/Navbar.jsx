import { useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../utils/session";

function Navbar() {
    const navigate = useNavigate();
    const user = getStoredUser();

    const handleLogout = () => {
        clearSession();
        navigate("/login");
    };

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur md:px-8">
            <button
                type="button"
                className="flex items-center gap-3"
                onClick={() => navigate("/dashboard")}
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">
                    S
                </span>
                <span className="text-xl font-bold text-slate-950">SecureSign</span>
            </button>

            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-slate-800">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-500">{user?.email || ""}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

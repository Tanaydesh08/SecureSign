function Sidebar({ activeTab, setActiveTab }) {
    const menus = [
        { id: "overview", label: "Dashboard" },
        { id: "upload", label: "Upload" },
        { id: "documents", label: "Documents" }
    ];

    return (
        <>
            <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white p-4 shadow-sm md:block">
                <div className="p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Workspace
                    </p>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                    {menus.map((menu) => (
                        <NavButton
                            key={menu.id}
                            menu={menu}
                            active={activeTab === menu.id}
                            onClick={() => setActiveTab(menu.id)}
                        />
                    ))}
                </div>

                <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-800">Secure flow</p>
                    <p className="mt-1 text-xs text-emerald-700/70">
                        JWT auth, PDF upload, digital signatures and audit lookup.
                    </p>
                </div>
            </aside>

            <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white p-3 shadow-2xl md:hidden">
                {menus.map((menu) => (
                    <NavButton
                        key={menu.id}
                        menu={menu}
                        active={activeTab === menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        compact
                    />
                ))}
            </div>
        </>
    );
}

function NavButton({ menu, active, onClick, compact = false }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                compact ? "text-center" : ""
            } ${
                active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
        >
            {menu.label}
        </button>
    );
}

export default Sidebar;

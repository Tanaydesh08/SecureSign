function AuditTimeline({ logs, doc, onClose }) {
    const sortedLogs = [...logs].sort(
        (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            Audit
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-950">Activity timeline</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {doc?.title || `Document #${doc?.id}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        Close
                    </button>
                </div>

                {sortedLogs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                        <h3 className="font-semibold text-slate-800">No audit logs available</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            The audit endpoint responded, but the backend has not recorded activity for this document.
                        </p>
                    </div>
                ) : (
                    <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                        {sortedLogs.map((log) => (
                            <div key={log.id || `${log.action}-${log.timestamp}`} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <span className="absolute left-0 top-5 h-8 w-1 rounded-r-full bg-emerald-500" />
                                <h3 className="font-semibold text-slate-900">{log.action}</h3>
                                <p className="mt-1 text-sm text-slate-500">{formatTimestamp(log.timestamp)}</p>
                                <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                                    <p>
                                        User: <span className="font-mono text-slate-700">{log.user?.email || log.user?.name || "Unknown"}</span>
                                    </p>
                                    <p>
                                        IP: <span className="font-mono text-slate-700">{log.ipAddress || "Not captured"}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function formatTimestamp(timestamp) {
    if (!timestamp) return "Time not captured";

    try {
        return new Date(timestamp).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return timestamp;
    }
}

export default AuditTimeline;

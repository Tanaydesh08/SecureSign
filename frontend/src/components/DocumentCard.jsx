function DocumentCard({ doc, onDelete, onSign, onViewAudit }) {
    const status = doc.effectiveStatus || doc.status || "PENDING";
    const statusColor = {
        SIGNED: "bg-emerald-100 text-emerald-700",
        PENDING: "bg-amber-100 text-amber-700",
        REJECTED: "bg-red-100 text-red-700"
    };

    return (
        <article className="flex min-h-60 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-950">{doc.title}</h3>
                    <p className="mt-1 truncate text-sm text-slate-500">{doc.fileName}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor[status] || "bg-slate-100 text-slate-700"}`}>
                    {status}
                </span>
            </div>

            <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Owner</dt>
                    <dd className="truncate font-medium text-slate-800">
                        {doc.owner?.name || doc.owner?.email || "Unknown"}
                    </dd>
                </div>
                <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Signatures</dt>
                    <dd className="font-medium text-slate-800">{doc.signatures?.length || 0}</dd>
                </div>
                <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Created</dt>
                    <dd className="font-medium text-slate-800">{formatDate(doc.createdAt)}</dd>
                </div>
            </dl>

            <div className="mt-auto grid grid-cols-3 gap-2 pt-6">
                <button
                    onClick={() => onSign(doc)}
                    disabled={status === "SIGNED"}
                    className={`rounded-xl py-2 text-sm font-semibold transition ${
                        status === "SIGNED"
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                >
                    Sign
                </button>
                <button
                    onClick={() => onViewAudit(doc)}
                    className="rounded-xl bg-slate-100 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                    Audit
                </button>
                <button
                    onClick={() => onDelete(doc.id)}
                    className="rounded-xl bg-red-50 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

function formatDate(value) {
    if (!value) return "Not set";

    try {
        return new Date(value).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch {
        return value;
    }
}

export default DocumentCard;

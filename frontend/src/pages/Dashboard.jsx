import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UploadCard from "../components/UploadCard";
import DocumentCard from "../components/DocumentCard";
import SignatureModal from "../components/SignatureModal";
import AuditTimeline from "../components/AuditTimeline";
import {
    deleteDocument,
    getAuditLogs,
    getDocuments,
    getSignatures
} from "../api/api";
import { getStoredUser, updateStoredUser } from "../utils/session";

function enrichDocument(document, signatures = []) {
    const signed = signatures.some((signature) => signature.status === "SIGNED");

    return {
        ...document,
        signatures,
        effectiveStatus: signed ? "SIGNED" : document.status || "PENDING"
    };
}

function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [auditDocument, setAuditDocument] = useState(null);
    const toastTimeoutRef = useRef(null);

    const showToast = (message) => {
        setToast(message);
        window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = window.setTimeout(() => setToast(""), 3000);
    };

    useEffect(() => {
        return () => window.clearTimeout(toastTimeoutRef.current);
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);

        try {
            const response = await getDocuments();
            const rawDocuments = Array.isArray(response.data) ? response.data : [];

            const enriched = await Promise.all(
                rawDocuments.map(async (document) => {
                    try {
                        const signatureResponse = await getSignatures(document.id);
                        return enrichDocument(document, signatureResponse.data || []);
                    } catch {
                        return enrichDocument(document, []);
                    }
                })
            );

            const storedUser = getStoredUser();
            const owner = enriched.find(
                (document) => document.owner?.email && document.owner.email === storedUser?.email
            )?.owner;

            if (owner?.id && !storedUser?.id) {
                updateStoredUser({
                    id: owner.id,
                    name: storedUser?.name || owner.name,
                    email: storedUser?.email || owner.email
                });
            }

            setDocuments(enriched);
        } catch (error) {
            console.log(error);
            showToast("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this document?");
        if (!confirmDelete) return;

        try {
            await deleteDocument(id);
            showToast("Document deleted");
            fetchDocuments();
        } catch (error) {
            console.log(error);
            showToast("Failed to delete document");
        }
    };

    const handleAudit = async (document) => {
        try {
            const response = await getAuditLogs(document.id);
            setAuditLogs(Array.isArray(response.data) ? response.data : []);
            setAuditDocument(document);
        } catch (error) {
            console.log(error);
            showToast("Failed to load audit logs");
        }
    };

    const filteredDocuments = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return documents;

        return documents.filter((doc) =>
            [doc.title, doc.fileName, doc.owner?.name, doc.owner?.email]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [documents, search]);

    const stats = useMemo(() => {
        const total = documents.length;
        const signed = documents.filter((doc) => doc.effectiveStatus === "SIGNED").length;
        const pending = documents.filter((doc) => doc.effectiveStatus === "PENDING").length;
        const rejected = documents.filter((doc) => doc.effectiveStatus === "REJECTED").length;

        return { total, signed, pending, rejected };
    }, [documents]);

    const documentList = (
        <section className="mt-8">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950">Documents</h2>
                    <p className="text-sm text-slate-500">
                        Upload, sign, audit and manage your PDFs.
                    </p>
                </div>
                <input
                    type="text"
                    placeholder="Search documents"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-80"
                />
            </div>

            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-emerald-700 shadow-sm">
                    Loading documents...
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <h3 className="text-xl font-semibold text-slate-800">No documents found</h3>
                    <p className="mt-2 text-slate-500">
                        Upload a PDF to start the signing flow.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredDocuments.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            doc={doc}
                            onDelete={handleDelete}
                            onSign={setSelectedDocument}
                            onViewAudit={handleAudit}
                        />
                    ))}
                </div>
            )}
        </section>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {toast && (
                <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
                    {toast}
                </div>
            )}

            <main className="px-4 pb-24 pt-24 md:ml-64 md:px-8 md:pb-10">
                <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
                    <div className="bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.34),transparent_32%)] p-7 md:p-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                            Document Signature App
                        </p>
                        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold md:text-4xl">
                                    SecureSign workspace
                                </h1>
                                <p className="mt-3 max-w-2xl text-slate-300">
                                    Upload PDFs, capture signatures and review audit history from one clean dashboard.
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab("upload")}
                                className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 lg:w-auto"
                            >
                                Upload document
                            </button>
                        </div>
                    </div>
                </section>

                {activeTab === "overview" && (
                    <>
                        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <StatCard label="Total" value={stats.total} />
                            <StatCard label="Pending" value={stats.pending} tone="amber" />
                            <StatCard label="Signed" value={stats.signed} tone="emerald" />
                            <StatCard label="Rejected" value={stats.rejected} tone="red" />
                        </section>
                        {documentList}
                    </>
                )}

                {activeTab === "upload" && (
                    <section className="mt-8">
                        <UploadCard
                            onUploadSuccess={() => {
                                fetchDocuments();
                                setActiveTab("documents");
                            }}
                            showToast={showToast}
                        />
                    </section>
                )}

                {activeTab === "documents" && documentList}
            </main>

            {selectedDocument && (
                <SignatureModal
                    doc={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                    onSignatureSuccess={() => {
                        fetchDocuments();
                        showToast("Document signed successfully");
                    }}
                    showToast={showToast}
                />
            )}

            {auditDocument && (
                <AuditTimeline
                    logs={auditLogs}
                    doc={auditDocument}
                    onClose={() => {
                        setAuditDocument(null);
                        setAuditLogs([]);
                    }}
                />
            )}
        </div>
    );
}

function StatCard({ label, value, tone = "slate" }) {
    const tones = {
        slate: "text-slate-950 bg-slate-100",
        amber: "text-amber-700 bg-amber-100",
        emerald: "text-emerald-700 bg-emerald-100",
        red: "text-red-700 bg-red-100"
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold">{value}</h2>
                <span className={`h-3 w-3 rounded-full ${tones[tone]}`} />
            </div>
        </div>
    );
}

export default Dashboard;

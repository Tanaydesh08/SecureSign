import { useState } from "react";
import { uploadDocument } from "../api/api";
import { resolveUserId, updateStoredUser } from "../utils/session";

function UploadCard({ onUploadSuccess, showToast }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [userId, setUserId] = useState(resolveUserId());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !file) {
            showToast("Please add a title and PDF file");
            return;
        }

        if (!Number(userId)) {
            showToast("Backend user ID is required");
            return;
        }

        try {
            setLoading(true);
            updateStoredUser({ id: Number(userId) });
            localStorage.setItem("userId", String(userId));

            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("file", file);
            formData.append("userId", Number(userId));

            await uploadDocument(formData);

            showToast("Document uploaded successfully");
            setTitle("");
            setFile(null);
            onUploadSuccess();
        } catch (error) {
            console.log(error);
            showToast(error.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    New document
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Upload PDF</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Spring Boot requires a user id with each upload. If your auth response does not include it, keep the id that matches your backend user.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        placeholder="Agreement"
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-[1fr_160px]">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700">PDF File</label>
                        <label className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
                            <span className="font-semibold text-slate-800">
                                {file ? file.name : "Choose a PDF"}
                            </span>
                            <span className="mt-1 text-sm text-slate-500">
                                {file ? `${Math.ceil(file.size / 1024)} KB selected` : "PDF files up to backend limit"}
                            </span>
                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="sr-only"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">
                            User ID
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                    {loading ? "Uploading..." : "Upload Document"}
                </button>
            </form>
        </div>
    );
}

export default UploadCard;

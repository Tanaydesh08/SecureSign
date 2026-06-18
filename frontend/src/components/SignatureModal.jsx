import { useState } from "react";
import { addSignature } from "../api/api";
import { resolveUserId, updateStoredUser } from "../utils/session";

const SIGNATURE_FONTS = [
    { id: "dancing", label: "Dancing Script", className: "font-signature-dancing" },
    { id: "allura", label: "Allura", className: "font-signature-allura" },
    { id: "great-vibes", label: "Great Vibes", className: "font-signature-great-vibes" },
    { id: "parisienne", label: "Parisienne", className: "font-signature-parisienne" },
    { id: "sacramento", label: "Sacramento", className: "font-signature-sacramento" }
];

function SignatureModal({ doc, onClose, onSignatureSuccess, showToast }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [xCoordinate, setXCoordinate] = useState(150);
    const [yCoordinate, setYCoordinate] = useState(320);
    const [signatureText, setSignatureText] = useState("");
    const [signatureFont, setSignatureFont] = useState(SIGNATURE_FONTS[0].id);
    const [userId, setUserId] = useState(resolveUserId(doc.owner?.id));
    const [loading, setLoading] = useState(false);
    const selectedFont = SIGNATURE_FONTS.find((font) => font.id === signatureFont) || SIGNATURE_FONTS[0];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!signatureText.trim()) {
            showToast("Please enter your signature");
            return;
        }

        if (!Number(userId)) {
            showToast("Backend user ID is required");
            return;
        }

        setLoading(true);
        try {
            updateStoredUser({ id: Number(userId) });
            localStorage.setItem("userId", String(userId));

            const payload = {
                documentId: doc.id,
                userId: Number(userId),
                pageNumber: Number(pageNumber),
                xCoordinate: Number(xCoordinate),
                yCoordinate: Number(yCoordinate),
                signatureImage: signatureText.trim(),
                signatureFont
            };

            await addSignature(payload);

            onSignatureSuccess();
            onClose();
        } catch (error) {
            console.log(error);
            showToast(error.response?.data?.message || "Unable to sign document");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            Signature
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-950">Sign document</h2>
                        <p className="mt-1 text-sm text-slate-500">{doc.title}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-4">
                        <NumberField label="Page" value={pageNumber} setValue={setPageNumber} min="1" />
                        <NumberField label="X" value={xCoordinate} setValue={setXCoordinate} />
                        <NumberField label="Y" value={yCoordinate} setValue={setYCoordinate} />
                        <NumberField label="User ID" value={userId} setValue={setUserId} min="1" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">Typed signature</label>
                        <input
                            type="text"
                            value={signatureText}
                            onChange={(e) => setSignatureText(e.target.value)}
                            placeholder="Type your full name"
                            className={`mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 text-3xl outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${selectedFont.className}`}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-700">Signature font</p>
                        <div className="mt-2 grid gap-3 sm:grid-cols-5">
                            {SIGNATURE_FONTS.map((font) => (
                                <button
                                    key={font.id}
                                    type="button"
                                    onClick={() => setSignatureFont(font.id)}
                                    className={`rounded-xl border px-3 py-3 text-center transition ${
                                        signatureFont === font.id
                                            ? "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <span className={`block text-2xl text-slate-950 ${font.className}`}>
                                        {signatureText || "Sign"}
                                    </span>
                                    <span className="mt-2 block text-[11px] font-semibold text-slate-500">
                                        {font.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-600">Preview</p>
                        <p className={`mt-3 min-h-14 text-4xl text-slate-950 ${selectedFont.className}`}>
                            {signatureText || "Your Signature"}
                        </p>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                        >
                            {loading ? "Signing..." : "Sign Document"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NumberField({ label, value, setValue, min }) {
    return (
        <div>
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            <input
                type="number"
                min={min}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
        </div>
    );
}

export default SignatureModal;

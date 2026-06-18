import axios from "axios";
import { clearSession } from "../utils/session";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});

// Automatically attach JWT
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 Unauthorized — clear session and redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearSession();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// =========================
// AUTH
// =========================

export const registerUser = (data) =>
    API.post("/auth/register", data);

export const loginUser = (data) =>
    API.post("/auth/login", data);

// =========================
// DOCUMENTS
// =========================

export const uploadDocument = (formData) =>
    API.post(
        "/documents/upload",
        formData
    );

export const getDocuments = () =>
    API.get("/documents");

export const getDocumentById = (id) =>
    API.get(`/documents/${id}`);

export const deleteDocument = (id) =>
    API.delete(`/documents/${id}`);

// =========================
// SIGNATURE
// =========================

export const addSignature = (data) =>
    API.post("/signatures", data);

export const getSignatures = (documentId) =>
    API.get(`/signatures/${documentId}`);

export const updateSignatureStatus = (id, status) =>
    API.put(`/signatures/${id}/status`, null, {
        params: { status }
    });

// =========================
// AUDIT
// =========================

export const getAuditLogs = (documentId) =>
    API.get(`/aduit/${documentId}`);

export default API;

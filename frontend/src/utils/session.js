export function decodeJwtPayload(token) {
    if (!token) return {};

    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return {};

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join("")
        );

        return JSON.parse(json);
    } catch {
        return {};
    }
}

export function getStoredUser() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && typeof user === "object" ? user : null;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

export function saveSession({ token, user }) {
    localStorage.setItem("token", token);

    const tokenPayload = decodeJwtPayload(token);
    const normalizedUser = {
        email: user?.email || tokenPayload.sub || "",
        name: user?.name || user?.email || tokenPayload.sub || "User",
        id: user?.id || user?.userId || null
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    return normalizedUser;
}

export function updateStoredUser(patch) {
    const current = getStoredUser() || {};
    const next = { ...current, ...patch };
    localStorage.setItem("user", JSON.stringify(next));
    return next;
}

export function resolveUserId(fallback = 1) {
    const user = getStoredUser();
    return Number(user?.id || localStorage.getItem("userId") || fallback);
}

export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
}

// Shared auth helpers for token storage, validation, and auth error checks

export const AUTH_CHANGE_EVENT = "filmhouse-auth-change";
export const SESSION_EXPIRED_MESSAGE = "Your session has expired. Redirecting to login...";

function notifyAuthChange() {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

// Read the saved login token
export function getAuthToken() {
    return localStorage.getItem("token");
}

// Save a new login token
export function setAuthToken(token) {
    localStorage.setItem("token", token);
    notifyAuthChange();
}

// Remove the saved login token
export function clearAuthToken() {
    localStorage.removeItem("token");
    notifyAuthChange();
}

// Decode the token payload safely
export function getTokenPayload(token = getAuthToken()) {
    if (!token) {
        return null;
    }

    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

// Check whether a decoded token has expired
export function tokenHasExpired(payload) {
    return Boolean(payload?.exp && payload.exp * 1000 <= Date.now());
}

// Validate a logged-in regular user session
export function isValidUserToken() {
    const payload = getTokenPayload();

    return Boolean(payload && !tokenHasExpired(payload));
}

// Validate a logged-in admin session
export function isValidAdminToken() {
    const payload = getTokenPayload();

    return Boolean(payload && payload.role === "admin" && !tokenHasExpired(payload));
}

// Detect API errors caused by missing or expired auth
export function isAuthError(error) {
    const detail = error.response?.data?.detail || "";

    return (
        error.response?.status === 401 ||
        detail.toLowerCase().includes("token")
    );
}

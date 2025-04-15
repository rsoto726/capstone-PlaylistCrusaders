const BASE_URL = 'http://localhost:8080/auth';

const fetchWithCredentials = async (
    url: string,
    options: RequestInit = {}
) => {
    const response = await fetch(`${BASE_URL}${url}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `HTTP error ${response.status}`);
    }

    return response.json();
};

// AUTH FUNCTIONS

export const getLoggedIn = () =>
    fetchWithCredentials('/loggedIn/', { method: 'GET' });

export const loginUser = (
    email: string,
    password: string
) =>
    fetchWithCredentials('/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

export const logoutUser = () =>
    fetchWithCredentials('/logout/', { method: 'GET' });

export const registerUser = (
    username: string,
    email: string,
    password: string,
    passwordVerify: string // "Re-enter password" to ensure user entered the intended password
) =>
    fetchWithCredentials('/register/', {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password,
            passwordVerify,
        }),
    });

const apis = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
};

export default apis;
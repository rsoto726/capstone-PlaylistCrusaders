const BASE_URL = 'http://localhost:8080/api/user';

const fetchWithCredentials = async (
    url: string,
    options: RequestInit = {}
) => {
    const response = await fetch(`${BASE_URL}${url}`, {
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
) =>
    fetchWithCredentials('/register/', {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

const apis = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
};

export default apis;
const BASE_URL = 'http://localhost:8080/api/user';

const fetchWithCredentials = async (
    url: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
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

export const loginUser = async (email: string, password: string) => {
    const response = await fetchWithCredentials('/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    if (response.token) {
        localStorage.setItem('token', response.token);
    }

    return response;
};

export const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null; // No token, not logged in
    }

    try {
        const response = await fetchWithCredentials('/loggedin/', {
            method: 'GET',
        });

        if (response?.token) {
            localStorage.setItem('token', response.token); //valid token
            
            return response;
        }

        localStorage.removeItem('token');  // bad token
        return null;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

export const logoutUser = () =>
    localStorage.removeItem('token');

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
    checkSession,
};

export default apis;
export { fetchWithCredentials };
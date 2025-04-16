const BASE_URL = 'http://localhost:8080/api';


const fetchWithCredentials = async (
    url: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        ...(options.headers || {}),
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },      
      ...options,
    });
  
    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }
  
    const text = await response.text();
  
    if (!response.ok) {
      let errorBody: any = {};
      try {
        errorBody = text ? JSON.parse(text) : {};
      } catch {
        // ignore parsing error, leave errorBody as {}
      }
  
      const message = typeof errorBody === 'object' && 'message' in errorBody
        ? errorBody.message
        : `HTTP error ${response.status}`;
  
      throw new Error(message);
    }
  
    return text ? JSON.parse(text) : null;
  };

// AUTH FUNCTIONS

export const getLoggedIn = () =>
    fetchWithCredentials('/user/loggedin/', { method: 'GET' });

export const loginUser = async (email: string, password: string) => {
    const response = await fetchWithCredentials('/user/login/', {
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
        const response = await fetchWithCredentials('/user/loggedin/', {
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
    fetchWithCredentials('/user/register/', {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    }
);

const apis = {
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
    checkSession,
};

export default apis;
export { fetchWithCredentials };
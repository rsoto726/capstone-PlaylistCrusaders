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
    let errorMessages: string[] = [];

    try {
      const parsed = JSON.parse(text);

      // If it's an array like ['error1', 'error2']
      if (Array.isArray(parsed)) {
        errorMessages = parsed;
      }
      // If it's an object with a 'text' property that's an array
      else if (parsed && Array.isArray(parsed.text)) {
        errorMessages = parsed.text;
      }
      // Fallback if it's a string
      else if (typeof parsed === 'string') {
        errorMessages = [parsed];
      }
    } catch (err) {
      console.warn("Failed to parse error text:", text);
      errorMessages = [`HTTP error ${response.status}`];
    }

    const combinedMessage = errorMessages.join('\n');
    throw new Error(combinedMessage);
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
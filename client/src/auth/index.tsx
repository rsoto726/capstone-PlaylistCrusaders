import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from './auth-req-api';

interface User {
    id: number;
    username: string;
    email: string;
}

type VisitorType = 'NONE' | 'USER' | 'ADMIN';

interface AuthState {
    user: User | null;
    loggedIn: boolean;
    errorMessages: string[];
    visitor: VisitorType;
}

interface AuthContextType {
    auth: AuthState & typeof authMethods;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let authMethods: any = {};

export const AuthActionType = {
    GET_LOGGED_IN: 'GET_LOGGED_IN',
    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER',
    REGISTER_USER: 'REGISTER_USER',
    ERROR: 'ERROR'
} as const;

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        loggedIn: false,
        errorMessages: [],
        visitor: 'NONE'
    });
    useEffect(() => {
        getLoggedIn();
    }, []);

    const authReducer = (
        type: keyof typeof AuthActionType,
        payload: Partial<AuthState> = {}
    ) => {
        setAuth((prev) => ({
            ...prev,
            ...payload,
            errorMessages: type === 'ERROR' ? payload.errorMessages ?? [] : [],
            visitor: payload.visitor || prev.visitor,
        }));
    };

    const getLoggedIn = async () => {
        try {
            const data = await api.getLoggedIn();
            console.log(data);
            authReducer('GET_LOGGED_IN', {
                loggedIn: data.loggedIn,
                user: data.user,
            });
        } catch (err: any) {
            authReducer('ERROR', { errorMessages: err.message });
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            const data = await api.loginUser(email, password);
            console.log(data);
            authReducer('LOGIN_USER', {
                user: data.user,
                loggedIn: true,
                visitor: 'USER',
            });
            navigate('/');
        } catch (err: any) {
            authReducer('ERROR', { errorMessages: err.message });
        }
    };

    const registerUser = async (
        username: string,
        email: string,
        password: string,
    ) => {
        try {
            await api.registerUser(username, email, password);
            authReducer('REGISTER_USER');
            navigate('/login');
        } catch (err: any) {
            authReducer('ERROR', { errorMessages: err.message });
        }
    };

    const logoutUser = async () => {
        try {
            await api.logoutUser();
            authReducer('LOGOUT_USER', {
                user: null,
                loggedIn: false,
                visitor: 'NONE',
            });
            navigate('/');
        } catch (err: any) {
            authReducer('ERROR', { errorMessages: err.message });
        }
    };

    authMethods = {
        getLoggedIn,
        loginUser,
        registerUser,
        logoutUser
    };

    return (
        <AuthContext.Provider value={{ auth: { ...auth, ...authMethods } }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};
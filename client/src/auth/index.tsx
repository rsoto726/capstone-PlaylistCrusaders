import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from './auth-req-api';

interface User {
    userId: number;
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

let authMethods: any = {}; // This can be improved with better typing

export const AuthActionType = {
    GET_LOGGED_IN: 'GET_LOGGED_IN',
    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER',
    REGISTER_USER: 'REGISTER_USER',
    ERROR: 'ERROR',
} as const;

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        loggedIn: false,
        errorMessages: [],
        visitor: 'NONE',
    });

    useEffect(() => {
        const verifySession = async () => {
            try {
                const sessionUser = await api.checkSession();
                // console.log(sessionUser);
                if (sessionUser) {
                    authReducer('GET_LOGGED_IN', {
                        user: sessionUser,
                        loggedIn: true,
                        visitor: 'USER',
                    });
                }
            } catch (err: any) {
                authReducer('ERROR', { errorMessages: [err.message] });
            }
        };

        verifySession();
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
            authReducer('GET_LOGGED_IN', {
                loggedIn: data.loggedIn,
                user: data.user,
            });
        } catch (err: any) {
            authReducer('ERROR', { errorMessages: [err.message] });
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            const data = await api.loginUser(email, password);
            authReducer('LOGIN_USER', {
                user: data.user,
                loggedIn: true,
                visitor: 'USER',
            });
            navigate('/');
        } catch (err: any) {
            let messages: string[] = [];

            if (Array.isArray(err)) {
                messages = err;
            } else if (err?.message) {
                messages = [err.message];
            } else {
                messages = ['An unexpected error occurred.'];
            }

            authReducer('ERROR', { errorMessages: messages });

            alert(messages.join('\n'));
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
            let messages: string[] = [];

            console.log(err);

            if (Array.isArray(err)) {
                messages = err;
            } else if (err?.message) {
                messages = [err.message];
            } else {
                messages = ['An unexpected error occurred.'];
            }

            authReducer('ERROR', { errorMessages: messages });
            
            alert(messages.join('\n'));
        }
    };

    const logoutUser = () => {
        api.logoutUser();
        authReducer('LOGOUT_USER', {
            user: null,
            loggedIn: false,
            visitor: 'NONE',
        });
        navigate('/');
    };

    authMethods = {
        getLoggedIn,
        loginUser,
        registerUser,
        logoutUser,
        checkSession: api.checkSession,
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

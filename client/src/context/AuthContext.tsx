import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";
import JwtManager from "../utils/jwt";

export interface IAuthContext {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    checkAuth: () => Promise<void>;
    logoutClient: () => void;
}

const defaultIsAuthenticated = false;

const AuthContext = createContext<IAuthContext>({
    isAuthenticated: defaultIsAuthenticated,
    setIsAuthenticated: () => {},
    checkAuth: () => Promise.resolve(),
    logoutClient: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        defaultIsAuthenticated
    );

    const checkAuth = useCallback(async () => {
        const token = JwtManager.getToken();
        if (token) setIsAuthenticated(true);
        else {
            const success = await JwtManager.getRefreshToken();

            if (success) setIsAuthenticated(true);
        }
    }, []);

    const logoutClient = () => {
        JwtManager.deleteToken();
        setIsAuthenticated(false);
    };

    const authContextData = {
        isAuthenticated,
        setIsAuthenticated,
        checkAuth,
        logoutClient,
    };

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export default AuthContextProvider;

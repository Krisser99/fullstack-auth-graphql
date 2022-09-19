import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

const JwtManager = () => {
    let inMemoryToken: string | null = null;
    // let refreshTokenTimeoutId: number | null = null;

    const getToken = () => inMemoryToken;

    const setToken = (accessToken: string) => {
        inMemoryToken = accessToken;

        // Decode and set countdown to refresh
        const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken);

        setRefreshTokenTimeout(
            (decoded.exp as number) - (decoded.iat as number)
        );

        return true;
    };

    const getRefreshToken = async () => {
        const response = await axios.get(
            "http://localhost:4000/refresh_token",
            { withCredentials: true }
        );

        setToken(response.data.accessToken);
        return true;
    };

    const setRefreshTokenTimeout = (delay: number) => {
        // 5s before token expires
        window.setTimeout(getRefreshToken, delay * 1000 - 5000);
    };

    return { getToken, setToken };
};

export default JwtManager();

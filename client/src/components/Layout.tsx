import { Link, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useLogoutMutation } from "../generated/graphql";
import JwtManager from "../utils/jwt";

const Layout = () => {
    const { isAuthenticated, logoutClient } = useAuthContext();

    const [logoutServer] = useLogoutMutation();

    const logout = () => {
        logoutClient();

        logoutServer({
            variables: { userId: JwtManager.getUserId()?.toString() as string },
        });
    };

    return (
        <>
            <h1>Authentication Jwt Fullstack</h1>
            <nav style={{ marginTop: 20, padding: 10 }}>
                <Link to=".">Home</Link> | <Link to="login">Login</Link> |{" "}
                <Link to="/register">Register</Link> |{" "}
                <Link to="/profile">Profile</Link>
                {isAuthenticated && (
                    <>
                        |{" "}
                        <button
                            onClick={logout}
                            className="p-1 outline bg-slate-500 text-white"
                        >
                            Logout
                        </button>
                    </>
                )}
            </nav>
            <Outlet />
        </>
    );
};

export default Layout;

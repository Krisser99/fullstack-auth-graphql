import { Link, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <h1>Authentication Jwt Fullstack</h1>
            <nav style={{ marginTop: 20, padding: 10 }}>
                <Link to=".">Home</Link> | <Link to="login">Login</Link> |
                {" "}
                <Link to="/register">Register</Link> |{" "}
                <Link to="/profile">Profile</Link>
            </nav>
            <Outlet />
        </>
    );
};

export default Layout;

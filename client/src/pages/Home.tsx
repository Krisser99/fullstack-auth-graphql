import { useUserQuery } from "../generated/graphql";

const Home = () => {
    const { data, loading } = useUserQuery({ fetchPolicy: "no-cache" });

    if (loading) return <h1>Loading...</h1>;

    return (
        <ul>
            {data?.users.map((user) => (
                <li key={user.id}>{user.username}</li>
            ))}
        </ul>
    );
};

export default Home;

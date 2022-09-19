import { useHelloQuery } from "../generated/graphql";

const Profile = () => {
    const { loading, error, data } = useHelloQuery({ fetchPolicy: "no-cache" });

    if (loading) return <h2>Loading ...</h2>;

    if (error) return <h2>{JSON.stringify(error)}</h2>;

    return <h1>{data?.hello}</h1>;
};

export default Profile;

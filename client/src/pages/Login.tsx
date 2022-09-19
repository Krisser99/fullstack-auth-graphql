import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import JwtManager from "../utils/jwt";

type FormData = {
    username: string;
    password: string;
};

const schema = yup.object().shape({
    username: yup.string().required("Vui lòng nhập tên đăng nhập"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
    const { register, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [login, _] = useLoginMutation();

    const onSubmit = async (data: FormData) => {
        const response = await login({
            variables: {
                loginInput: {
                    username: data.username,
                    password: data.password,
                },
            },
        });
        if (response.data?.login.success) {
            JwtManager.setToken(response.data.login.accessToken as string);
            navigate("..");
        } else {
            response.data?.login.message &&
                setError(response.data?.login.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl text-center text-gray-700 mb-6">
                Đăng Nhập
            </h1>
            {error && <h2 className="text-red-500 text-xl">{error}</h2>}
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <input
                    className="w-80 px-3 py-4 mb-4 outline-none border-none bg-gray-200 text-black rounded"
                    {...register("username")}
                    type="text"
                    placeholder="username"
                />
                <input
                    className="w-80 px-3 py-4 mb-4 outline-none border-none bg-gray-200 text-black rounded"
                    {...register("password")}
                    type="password"
                    placeholder="password"
                />
                <button className="bg-blue-600 rounded px-5 py-3 uppercase">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;

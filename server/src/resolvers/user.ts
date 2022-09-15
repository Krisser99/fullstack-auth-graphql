import argon2 from "argon2";
import { LoginInput } from "../types/LoginInput";
import { Mutation, Resolver, Arg } from "type-graphql";
import { User } from "../entities/User";
import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { createToken } from "../utils/auth";

@Resolver()
export class UserResolver {
    @Mutation((_return) => UserMutationResponse)
    async register(
        @Arg("registerInput") registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const { username, password } = registerInput;

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: "Duplicated username",
            };
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = User.create({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        return {
            code: 200,
            success: true,
            message: "user registration successful",
            user: newUser,
        };
    }

    @Mutation((_return) => UserMutationResponse)
    async login(
        @Arg("loginInput") { username, password }: LoginInput
    ): Promise<UserMutationResponse> {
        const existingUser = await User.findOne({ where: { username } });

        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: "User not found",
            };
        }

        const isPasswordValid = await argon2.verify(existingUser.password, password);

        if (!isPasswordValid) {
            return {
                code: 400,
                success: false,
                message: "Incorrect password",
            };
        }

        return {
            code: 200,
            success: true,
            message: "Logged is successfully",
            user: existingUser,
            accessToken: createToken(existingUser),
        };
    }
}

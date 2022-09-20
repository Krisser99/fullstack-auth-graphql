import argon2 from "argon2";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import { LoginInput } from "../types/LoginInput";
import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { createToken, sendRefreshToken } from "../utils/auth";

@Resolver()
export class UserResolver {
    @Query((_return) => [User])
    async users(): Promise<User[]> {
        return await User.find();
    }
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
        @Arg("loginInput") { username, password }: LoginInput,
        @Ctx() { res }: Context
    ): Promise<UserMutationResponse> {
        const existingUser = await User.findOne({ where: { username } });

        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: "User not found",
            };
        }

        const isPasswordValid = await argon2.verify(
            existingUser.password,
            password
        );

        if (!isPasswordValid) {
            return {
                code: 400,
                success: false,
                message: "Incorrect password",
            };
        }

        sendRefreshToken(res, existingUser);

        return {
            code: 200,
            success: true,
            message: "Logged is successfully",
            user: existingUser,
            accessToken: createToken("accessToken", existingUser),
        };
    }

    @Mutation((_return) => UserMutationResponse)
    async logout(
        @Arg("userId", (_type) => ID) userId: number,
        @Ctx() { res }: Context
    ): Promise<UserMutationResponse> {
        const existingUser = await User.findOne({ where: { id: userId } });

        if (!existingUser) {
            return {
                code: 400,
                success: false,
            };
        }

        existingUser.tokenVersion += 1;

        await existingUser.save();

        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string);

        return { code: 200, success: true };
    }
}

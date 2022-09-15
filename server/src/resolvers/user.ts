import argon2 from "argon2";
import { Mutation, Resolver, Arg } from "type-graphql";
import { User } from "../entities/User";
import { RegisterInput } from "../types/RegisterInput";
import { UserMutationResponse } from "../types/UserMutationResponse";

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
}

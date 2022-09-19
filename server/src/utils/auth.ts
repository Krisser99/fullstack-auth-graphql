import { Response } from "express";
import { Secret, sign } from "jsonwebtoken";
import { User } from "../entities/User";

export const createToken = (types: "accessToken" | "refeshToken", user: User) =>
    sign(
        { userId: user.id },

        types === "accessToken"
            ? (process.env.ACCESS_TOKEN_SECRET as Secret)
            : (process.env.REFRESH_TOKEN_SECRET as Secret),

        {
            expiresIn: types === "accessToken" ? "10s" : "60m",
        }
    );

export const sendRefeshToken = (res: Response, user: User) => {
    res.cookie(
        process.env.REFRESH_TOKEN_COOKIE_NAME as string,
        createToken("refeshToken", user),
        {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/refresh_token",
        }
    );
};

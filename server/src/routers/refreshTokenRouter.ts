import express, { Request, Response } from "express";
import { Secret, verify } from "jsonwebtoken";
import { User } from "../entities/User";
import { UserAuthPayload } from "../types/userAuthPayload";
import { createToken, sendRefeshToken } from "../utils/auth";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const refreshToken =
        req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];

    if (!refreshToken) return res.status(401);

    try {
        const decodedUser = verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret
        ) as UserAuthPayload;

        const existingUser = await User.findOne({
            where: { id: decodedUser.userId },
        });

        if (!existingUser) return res.status(401);

        sendRefeshToken(res, existingUser);

        return res.json({
            success: true,
            accessToken: createToken("accessToken", existingUser),
        });
    } catch (error) {
        console.log("ERROR REFRESHING TOKEN", error);
        res.status(403);
    }
    return;
});

export default router;

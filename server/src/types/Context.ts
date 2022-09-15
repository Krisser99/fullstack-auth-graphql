import { Request, Response } from "express";
import { UserAuthPayload } from "./userAuthPayload";

export interface Context {
    req: Request;
    res: Response;
    user: UserAuthPayload
}

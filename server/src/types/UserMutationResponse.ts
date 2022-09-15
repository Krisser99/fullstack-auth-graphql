import { IMutationResponse } from "./MutationResponse";
import { User } from "../entities/User";
import { ObjectType, Field } from "type-graphql";

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({ nullable: true })
    user?: User;
}

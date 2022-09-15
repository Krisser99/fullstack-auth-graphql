import { CheckAuth } from "../middleware/checkAuth";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Context } from "../types/Context";
import { User } from "../entities/User";

@Resolver()
export class GreetingResolver {
    @Query((_return) => String)
    @UseMiddleware(CheckAuth)
    async hello(@Ctx() { user }: Context): Promise<string> {
        const existingUser = await User.findOne({ where: { id: user.userId } });

        return `Hello ${existingUser ? existingUser.username : "world"}`;
    }
}

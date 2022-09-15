require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { GreetingResolver } from "./resolvers/greeting";
import { UserResolver } from "./resolvers/user";

const AppDataSource = new DataSource({
    type: "postgres",
    database: "jwt-auth",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    logging: true,
    entities: [User],
    port: process.env.DB_PORT as unknown as number,
});

const startApolloServer = async () => {
    const app = express();

    const httpServer = createServer(app);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            validate: false,
            resolvers: [GreetingResolver, UserResolver],
        }),
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground,
        ],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;

    await new Promise((resolve) =>
        httpServer.listen({ port: PORT }, resolve as () => void)
    );

    // typically, http://localhost:4000/graphql
    console.log(
        `SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
};

AppDataSource.initialize()
    .then(() => startApolloServer())
    .catch((error) => console.log("ERROR STARTING SERVER: ", error));
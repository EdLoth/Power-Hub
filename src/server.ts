import "reflect-metadata";

import {
Mail,
User,
Administrator,
Brand,
Category,
Product
} from "./graphql/resolvers";

import path from "path";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "prod" ? ".env" : ".env.dev" });

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
    Administrator,
    Mail,
    User,
    Brand,
    Category,
    Product,
    ],
    emitSchemaFile: path.resolve(__dirname, "newSchema.gql"),
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = express();

  app.use(cors());
  app.use(express.json());
  server.start().then(() => {
    server.applyMiddleware({ app, path: "/graphql/v1" });
    app.listen({ port: process.env.PORT }, () => {
      console.log(
        `Server ready at http://localhost:${process.env.PORT}${
          server.graphqlPath
        }\r\nVocê está no modo: ${
          process.env.NODE_ENV === "prod" ? ".env.prod" : ".env.dev"
        }`
      );
    });
  });
};

main();

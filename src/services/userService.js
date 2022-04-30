import {buildSubgraphSchema} from "@apollo/subgraph";
import {ApolloServer, gql} from "apollo-server-express";
import express from "express";

import { userData } from "./data";

const typeDefs = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User]
  }

  type User @key(fields: "id") {
    id: ID!
  }
`;

const resolvers = {
  User: {
    __resolveReference: async ({id}, {users}) => users.getById(id),
  },

  Query: {
    me: async (_, __, {userId, users}) => users.getById(userId),
    user: async (_, {id}, {users}) => users.getById(id),
    users: async (_, __, {users}) => users.getAll(),
  },
}

const schema = buildSubgraphSchema({typeDefs, resolvers});

export const start = async ({port}) => {
  const apolloServer = new ApolloServer({
    schema,
    context: async ({req}) => ({
      userId: req?.headers["x-user-id"],
      users: userData,
    }),
  });
  await apolloServer.start();
  const apolloRouter = apolloServer.getMiddleware();
  
  return new Promise((resolve) => {
    const app = express().use(apolloRouter).listen(port, () => {
      resolve({
        url: `http://localhost:${port}/graphql`,
        name: "user",
      })      
    });
  });
};
import {buildSubgraphSchema} from "@apollo/subgraph";
import {ApolloServer, gql} from "apollo-server-express";
import express from "express";

import {commitData} from "./data";

const typeDefs = gql`
  type Query {
    commit(id: ID!): Commit
    commits: [Commit]
  }

  type Mutation {
    commitCreate(input: CommitCreateInput!): CommitCreatePayload
  }
  input CommitCreateInput {
    message: String!
  }
  type CommitCreatePayload {
    commit: Commit
  }

  type Commit @key(fields: "id") {
    id: ID!
    sha: String
    short: String
    message: String
    user: User
  }

  type User @key(fields: "id") {
    id: ID!
    commits: [Commit]
  }
`;

const resolvers = {
  Commit: {
    __resolveReference: async ({id}, {commits}) => commits.getById(id),
    user: async ({userId}) => ({id: userId}),
  },

  User: {
    commits: async ({id}, _, {commits}) => commits.getAllByUserId(id),
  },

  Query: {
    commit: async (_, {id}, {commits}) => commits.getById(id),
    commits: async (_, __, {commits}) => commits.getAll(),
  },

  Mutation: {
    commitCreate: async (_, {input: {message}}, {userId, commits}) => {
      const commit = await commits.insert({message, userId});
      return {commit};
    },
  }
}

const schema = buildSubgraphSchema({typeDefs, resolvers});

export const start = async ({port}) => {
  const apolloServer = new ApolloServer({
    schema,
    context: async ({req}) => ({
      userId: req?.headers["x-user-id"],
      commits: commitData,
    }),
  });
  await apolloServer.start();
  const apolloRouter = apolloServer.getMiddleware();

  return new Promise((resolve) => {
    express().use(apolloRouter).listen(port, () => {
      resolve({
        url: `http://localhost:${port}/graphql`,
        name: "commit",
      })      
    });
  });
};
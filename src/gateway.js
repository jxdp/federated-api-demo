import {ApolloServer} from "apollo-server-express";
import {ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource} from "@apollo/gateway";
import express from "express";

export const startGateway = async ({port, subgraphs}) => {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({subgraphs}),
    buildService: ({url}) => new RemoteGraphQLDataSource({
      url,
      willSendRequest: ({request, context}) => {
        const userId = context.req?.headers?.authorization;
        request.http.headers.set("x-user-id", userId);
      },
    }),
  });
  const apolloServer = new ApolloServer({
    gateway,
    context: async (context) => context,
    subscriptions: false, // Subscriptions are not currently supported in Apollo Federation
  });
  await apolloServer.start();
  const apolloRouter = apolloServer.getMiddleware();

  express().use(apolloRouter).listen(port, () => {
    console.log(`🚀 Gateway ready at localhost:4000/graphql`);
  });
};

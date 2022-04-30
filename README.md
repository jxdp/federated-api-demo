# federated-api-demo
Demo of a federated graphql api with all services and gateway collocated.

A federated graph is one that is comprised of one or more subgraphs, which run in separate servers–essentially graphql microservices.
The gateway is responsible for exposing a unified graph and ensuring that fields in queries and mutations reach the correct subgraphs.

The demo contains the following:
- gateway
- subgraphs
  - user subgraph 
  - commit subgraph

Each subgraph, and the gateway, is exposed on a different port on the same host.

## User subgraph

The user subgraph defines a `User` type:

```graphql
type Query {
  me: User
  user(id: ID!): User
  users: [User]
}

type User @key(fields: "id") {
  id: ID!
}
```

## Commit subgraph

The commit subgraph defines a new `Commit` type and extends the `User` type:

```graphql
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
```

## Run the demo

Start the gateway by running `npm run dev`. You can then run queries against it like so:

![image](https://user-images.githubusercontent.com/63979647/166127783-3b380131-fdf8-4055-a070-a0e8006cdd53.png)

![image](https://user-images.githubusercontent.com/63979647/166127791-5c3e23ec-ca92-4145-9701-b4c3a00c1fa7.png)


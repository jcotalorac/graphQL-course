import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
        type Query {
            hello: String!
        }
`
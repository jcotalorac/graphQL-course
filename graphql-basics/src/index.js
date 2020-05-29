import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
        type Query {
            hello: String!
        }
`
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        }
    }
}
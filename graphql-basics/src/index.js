import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
        type Query {
            id: ID!
            name: String!
            age: Int!
            employed: Boolean!
            gpa: Float
        }

        type User {
            id: ID!
            name: String!
            email: String!
            age: Int
        }
`
const resolvers = {
    Query: {
        id() {
            return 'abc123'
        },
        name() {
            return 'Name JC'
        },
        age() {
            return 28
        },
        employed() {
            return true
        },
        gpa() {
            return 3.14
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!');
})
import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
        type Query {
            hello: String!
            name: String!
            location: String!
            bio: String!
        }
`
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name() {
            return 'Name JC'
        },
        location() {
            return 'My location'
        },
        bio() {
            return 'My bio'
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
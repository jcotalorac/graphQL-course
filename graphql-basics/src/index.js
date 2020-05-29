import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
        type Query {
            me: User!
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
        me() {
            return {
                id: 123098,
                name: 'Other name',
                email: 'mail',
                age: 28
            }
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
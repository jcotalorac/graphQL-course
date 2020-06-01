import { GraphQLServer } from 'graphql-yoga'

const users = [
    {
        id: '1',
        name: 'First',
        email: 'mail@mail',
        age: 28
    },
    {
        id: '2',
        name: 'Second',
        email: 'email@mail'
    },
    {
        id: '3',
        name: 'Third',
        email: 'em@em'
    }
]

const typeDefs = `
        type Query {
            users: [User!]!
            me: User!
            post: Post!
        }

        type User {
            id: ID!
            name: String!
            email: String!
            age: Int
        }

        type Post {
            id: ID!
            title: String!
            body: String!
            published: Boolean!
        }
`
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            return users
        },
        me() {
            return {
                id: 123098,
                name: 'Other name',
                email: 'mail',
                age: 28
            }
        },
        post() {
            return {
                id: 'asdqw12',
                title: 'Post title',
                body: 'Post body',
                published: false
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
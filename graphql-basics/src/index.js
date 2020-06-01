import { GraphQLServer } from 'graphql-yoga'

const typeDefs = `
        type Query {
            greeting(name: String): String!
            add(numbers: [Float!]!): Float!
            grades: [Int!]!
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
        greeting(parent, args, ctx, info) {
            console.log(args);
            if(args.name) {
                return `Hello ${args.name}`
            }
            return 'Hello!!'
        },
        add(parent, args, ctx, info) {
            if(args.numbers.lenght === 0) {
                return 0
            }
            return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            })
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93]
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
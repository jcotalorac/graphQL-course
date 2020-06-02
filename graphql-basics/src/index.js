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

const posts = [
    {
        id: '1',
        title: 'Title1',
        body: 'Body1',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Title2',
        body: 'Body2',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: 'Title3',
        body: 'Body3',
        published: false,
        author: '2'
    }
]

const typeDefs = `
        type Query {
            users(query: String): [User!]!
            posts(query: String): [Post!]!
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
            author: User!
        }
`
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if(!args.query) {
                return users
            }

            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase())
            )
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts
            }

            return posts.filter((post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
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
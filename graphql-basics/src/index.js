import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid'

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

const comments = [
    {
        id: '1',
        text: 'Comment1',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Comment2',
        author: '2',
        post: '2'
    },
    {
        id: '3',
        text: 'Comment3',
        author: '3',
        post: '3'
    },
    {
        id: '4',
        text: 'Comment4',
        author: '1',
        post: '1'
    }
]

const typeDefs = `
        type Query {
            users(query: String): [User!]!
            posts(query: String): [Post!]!
            comments: [Comment!]!
            me: User!
            post: Post!
        }

        type Mutation {
            createUser(data: CreateUserInput): User!
            createPost(data: CreatePostInput): Post!
            createComment(text: String!, author: ID!, post: ID!): Comment!
        }

        input CreateUserInput {
            name: String!
            email: String!
            age: Int
        }

        input CreatePostInput {
            title: String!
            body: String!
            published: Boolean!
            author: ID!
        }

        type User {
            id: ID!
            name: String!
            email: String!
            age: Int
            posts: [Post!]!
            comments: [Comment!]!
        }

        type Post {
            id: ID!
            title: String!
            body: String!
            published: Boolean!
            author: User!
            comments: [Comment!]!
        }

        type Comment {
            id: ID!
            text: String!
            author: User!
            post: Post!
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
        comments(parent, args, ctx, info) {
            return comments
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
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)
            
            if(emailTaken) {
                throw new Error('Email already exists')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user);
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            
            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const authorExist = users.some((user) => user.id === args.author)

            if(!authorExist) {
                throw new Error('The comment author does not exist')
            }

            const postExists = posts.some((post) => post.id === args.post && post.published)

            if(!postExists) {
                throw new Error('Post does not exist or is not published')
            }

            const comment = {
                id: uuidv4(),
                ...args
            }

            comments.push(comment)
            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id === parent.post)
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
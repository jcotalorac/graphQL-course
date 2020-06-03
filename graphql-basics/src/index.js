import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'

const resolvers = {
    Query,
    Mutation,
    Post,
    User,
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => user.id === parent.author)
        },
        post(parent, args, { db }, info) {
            return db.posts.find((post) => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!');
})
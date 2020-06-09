import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!');
})
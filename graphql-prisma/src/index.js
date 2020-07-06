import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import { resolvers, fragmentReplacements } from './resolvers/resolver'
import prisma from './prisma'

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start(({ port }) => {
    console.log('The server is up on port ' + port + '!');
})
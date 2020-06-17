import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

// prisma.query.users(null, '{ id name email posts { id title } }')
// .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

// prisma.query.comments(null, '{ id text author { id name } }')
// .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

prisma.mutation.createPost({
    data: {
        title: "My new GraphQL post is live!",
        body: "You can find the new course here",
        published: true,
        author: {
            connect: {
                id: "ckbd5f5if03hy0784dworkrig"
            }
        }
    }
}, '{ id title body published }')
.then((data) => {
    console.log(data);
    return prisma.query.users(null, '{ id name email posts { id title } }')
})
.then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
})
import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/resolver'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'thisismysupersecrettext',
    fragmentReplacements
})

export { prisma as default }

// prisma.query.users(null, '{ id name email posts { id title } }')
// .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

// prisma.query.comments(null, '{ id text author { id name } }')
// .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

// prisma.mutation.createPost({
//     data: {
//         title: "My new GraphQL post is live!",
//         body: "You can find the new course here",
//         published: true,
//         author: {
//             connect: {
//                 id: "ckbd5f5if03hy0784dworkrig"
//             }
//         }
//     }
// }, '{ id title body published }')
// .then((data) => {
//     console.log(data);
//     return prisma.query.users(null, '{ id name email posts { id title } }')
// })
// .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

/* prisma.mutation.updatePost({
    data: {
        body: "Updating body",
        published: true
    },
    where: {
        id: "ckbjx0krh0a0h08505ecl47f8"
    }
}, '{ id }')
.then((data) => {
    console.log(data);
    return prisma.query.posts(null, '{ id title body published }')
})
.then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
}) */

// prisma.exists.Comment({
//     id: "ckbd5oh8w03o00784hseyeh8s"
// })
// .then((exists) => {
//     console.log(exists);
// })

// const createPostForUser = async (authorId, data) => {
//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ id }')

//     const user = await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     }, '{ id name email posts { id title published } }')

//     return user
// }

// createPostForUser('ckbd5f5if03hy0784dworkrig', {
//     title: 'Great books to read',
//     body: 'The War of Art',
//     published: true
// })
// .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
// })
// .catch((error) => {
//     console.log(error);
// })

// const updatePostForUser = async (postId, data) => {
//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data
//     }, '{ author { id } }')
//     const user = await prisma.query.user({
//         where: {
//             id: post.author.id
//         }
//     }, '{ id name email posts { id title published } }')

//     return user
// }

// updatePostForUser('ckbjwt6vz09v90850tlm5v775', {
//     title: 'Metamorphosys',
//     published: false
// })
// .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// })
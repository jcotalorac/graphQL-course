import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import generateToken from '../../src/utils/generateToken'

const userOne = {
    input: {
        name: "name",
        email: "name@mail.com",
        password: bcrypt.hashSync("87654321")
    },
    user: undefined,
    jwt: undefined,
    posts: undefined,
    comments: undefined
}

const userTwo = {
    input: {
        name: "user2",
        email: "mail2@mail.com",
        password: bcrypt.hashSync("12345678")
    },
    user: undefined,
    jwt: undefined,
    posts: undefined,
    comments: undefined
}

const seedDatabase = async () => {
    userOne.posts = []
    userTwo.posts = []

    userOne.comments = []
    userTwo.comments = []
    
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = await generateToken(userOne.user.id)

    userOne.posts.push(await prisma.mutation.createPost({
        data: {
            title: "Published post",
            body: "Body published",
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    }))

    userOne.posts.push(await prisma.mutation.createPost({
        data: {
            title: "Unpublished post",
            body: "Body unpublished",
            published: false,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    }))

    /* userOne.comments.push(await prisma.mutation.createComment({
        data: {
            text: "Comment userOne",
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: userOne.posts[0].id
                }
            }
        }
    })) */

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = await generateToken(userTwo.user.id)

    /* userTwo.comments.push(await prisma.mutation.createComment({
        data: {
            text: "Comment userTwo",
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: userOne.posts[0].id
                }
            }
        }
    })) */
}

export { seedDatabase as default , userOne, userTwo }
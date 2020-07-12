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
    posts: undefined
}

const seedDatabase = async () => {
    userOne.posts = []
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
}

export { seedDatabase as default , userOne }
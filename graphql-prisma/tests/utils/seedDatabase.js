import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: "name",
        email: "name@mail.com",
        password: bcrypt.hashSync("87654321")
    }
}

const seedDatabase = async () => {
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: userOne.input
    })

    await prisma.mutation.createPost({
        data: {
            title: "Published post",
            body: "Body published",
            published: true,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: "Unpublished post",
            body: "Body unpublished",
            published: false,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
}

export { seedDatabase as default }
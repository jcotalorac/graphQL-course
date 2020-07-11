import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'

const seedDatabase = async () => {
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: "name",
            email: "name@mail.com",
            password: bcrypt.hashSync("87654321")
        }
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
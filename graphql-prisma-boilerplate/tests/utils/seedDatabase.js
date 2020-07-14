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
    jwt: undefined
}

const userTwo = {
    input: {
        name: "user2",
        email: "mail2@mail.com",
        password: bcrypt.hashSync("12345678")
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase = async () => {
    await prisma.mutation.deleteManyUsers()

    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = await generateToken(userOne.user.id)

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = await generateToken(userTwo.user.id)
}

export { seedDatabase as default , userOne, userTwo }
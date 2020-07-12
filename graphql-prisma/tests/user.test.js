import 'cross-fetch/polyfill'
import '@babel/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, me } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "user",
            email: "mail@mail.com",
            password: "12345678"
        }
    }
    
    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const userExist = await prisma.exists.User({
        id: response.data.createUser.id
    })

    expect(userExist).toBe(true)
})

test('Should expose public author profiles', async () => {
    const response = await client.query({
        query: getUsers
    })

    const savedUsers = await prisma.query.users()

    expect(response.data.users.length).toBe(savedUsers.length)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('name')
})

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "name@mail.com",
            password: "12345678"
        }
    }

    await expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow()
    
})

test('Should not sign up with invalid password', async () => {
    const variables = {
        data: {
            name: "anyname",
            email: "anymail",
            password: "123"
        }
    }

    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    
    const { data } = await client.query({
        query: me
    })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.input.name)
    expect(data.me.email).toBe(userOne.input.email)
})

test('Should throw auth error when profile is not authenticated', async () => {

    await expect(
        client.query({
            query: me
        })
    ).rejects.toThrow()
})
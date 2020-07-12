import 'cross-fetch/polyfill'
import '@babel/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser (
            data: $data
        ) {
            token
            user {
                id
                name
                email
            }
        }
    }
`

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
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `

    const response = await client.query({
        query: getUsers
    })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('name')
})

test('Should not login with bad credentials', async () => {
    const login = gql`
        mutation {
            loginUser(
                data: {
                    email: "name@mail.com"
                    password: "12345678"
                }
            ) {
                token
            }
        }
    `

    await expect(
        client.mutate({
            mutation: login
        })
    ).rejects.toThrow()
    
})

test('Should not sign up with short password', async () => {
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

    const me = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `

    const { data } = await client.query({
        query: me
    })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.input.name)
    expect(data.me.email).toBe(userOne.input.email)
})

test('Should throw auth error when profile is not authenticated', async () => {

    const me = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `

    await expect(
        client.query({
            query: me
        })
    ).rejects.toThrow()
})
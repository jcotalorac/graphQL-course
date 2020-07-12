import 'cross-fetch/polyfill'
import '@babel/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser (
                data: {
                    name: "user"
                    email: "mail@mail.com"
                    password: "12345678"
                }
            ) {
                token
                user {
                    id
                }
            }
        }
    `

    const response = await client.mutate({
        mutation: createUser
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
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "anyname"
                    email: "anymail"
                    password: "123"
                }
            ) {
                token
            }
        }
    `

    await expect(
        client.mutate({
            mutation: createUser
        })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(await userOne.jwt)

    const me = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `

    const response = await client.query({
        query: me
    })

    expect(response.data.me.name).toBe(userOne.input.name)
})
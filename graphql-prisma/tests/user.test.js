import 'cross-fetch/polyfill'
import '@babel/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'
import prisma from '../src/prisma'

const client = new ApolloBoost({
    uri: "http://localhost:4000"
})

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser (
                data: {
                    name: "user",
                    email: "mail@mail.com",
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
import 'cross-fetch/polyfill'
import '@babel/polyfill'
import getClient from './utils/getClientWithSubs'
import seedDatabase, { userOne, userTwo } from './utils/seedDatabase'
import { deleteComment } from './utils/operations'
import prisma from '../src/prisma'


const client = getClient()

beforeEach(seedDatabase)

test('Should delete own comment', async () => {
    const client = getClient(userTwo.jwt)

    const variables = {
        id: userTwo.comments[0].id
    }

    const { data } = await client.mutate({
        mutation: deleteComment,
        variables
    })

    const existsComment = await prisma.exists.Comment({
        id: data.deleteComment.id
    })

    expect(data.deleteComment.id).toBe(userTwo.comments[0].id)
    expect(existsComment).toBe(false)
})

test('Should not delete other users comment', async() => {
    const client = getClient(userTwo.jwt)

    const variables = {
        id: userOne.comments[0].id
    }

    await expect(
            client.mutate({
            mutation: deleteComment,
            variables
        }
    )).rejects.toThrow()
})
import 'cross-fetch/polyfill'
import '@babel/polyfill'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClientWithSubs'
import prisma from '../src/prisma'
import { getPosts, myPosts, updatePost, createPost, deletePost, subscribePost } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published posts', async () => {
    const response = await client.query({
        query: getPosts
    })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('Should show owned posts', async () => {
    const client = getClient(userOne.jwt)

    const { data } = await client.query({
        query: myPosts
    })

    expect(data.myPosts.length).toBe(userOne.posts.length)
})

test('Should be able to update own post', async () => {
    const client = getClient(userOne.jwt)
    const bodyUpdatedValue = "A new body updated"

    const variables = {
        id: userOne.posts[0].id,
        data: {
            body: bodyUpdatedValue,
            published: false
        }
    }
    
    const { data } = await client.mutate({
        mutation: updatePost,
        variables
    })

    const postExists = await prisma.exists.Post({
        id: userOne.posts[0].id,
        body: bodyUpdatedValue,
        published: false
    })

    expect(data.updatePost.body).toBe(bodyUpdatedValue)
    expect(data.updatePost.published).toBe(false)
    expect(postExists).toBe(true)
})

test('Should create a new post', async () => {
    const client = getClient(userOne.jwt)
    const input = {
        title: "Title post",
        body: "Body post",
        published: false
    }

    const variables = {
        data: input
    }

    const { data } = await client.mutate({
        mutation: createPost,
        variables
    })

    const existsPost = await prisma.exists.Post({
        id: data.createPost.id,
        ...input
    })

    expect(data.createPost.title).toBe(input.title)
    expect(data.createPost.body).toBe(input.body)
    expect(data.createPost.published).toBe(input.published)
    expect(existsPost).toBe(true)
})

test('Should delete a post', async () => {
    const client = getClient(userOne.jwt)

    const variables = {
        id: userOne.posts[1].id
    }

    const { data } = await client.mutate({
        mutation: deletePost,
        variables
    })

    const existsPost = await prisma.exists.Post({
        id: data.deletePost.id
    })

    expect(data.deletePost.id).toBe(userOne.posts[1].id)
    expect(existsPost).toBe(false)
})

test('Should notify post deletion in post subscription', async (done) => {
    client.subscribe({
        query: subscribePost
    }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe("DELETED")
            done()
        }
    })

    await prisma.mutation.deletePost({
        where: {
            id: userOne.posts[0].id
        }
    })
})
import 'cross-fetch/polyfill'
import '@babel/polyfill'
import { gql } from 'apollo-boost'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import prisma from '../src/prisma'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published posts', async () => {
    const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `

    const response = await client.query({
        query: getPosts
    })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('Should show owned posts', async () => {
    const client = getClient(userOne.jwt)

    const myPosts = gql`
        query {
            myPosts {
                id
                title
                published
            }
        }
    `

    const { data } = await client.query({
        query: myPosts
    })

    expect(data.myPosts.length).toBe(userOne.posts.length)
})

test('Should be able to update own post', async () => {
    const client = getClient(userOne.jwt)
    const bodyUpdatedValue = "A new body updated"

    const updatePost = gql`
        mutation {
            updatePost(
                id: "${userOne.posts[0].id}"
                data: {
                    body: "${bodyUpdatedValue}"
                    published: false
                }
            ) {
                id
                title
                body
                published
            }
        }
    `
    
    const { data } = await client.mutate({
        mutation: updatePost
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
import { gql, from } from 'apollo-boost'

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
const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`
const login = gql`
    mutation($data: LoginUserInput!) {
        loginUser(
            data: $data
        ) {
            token
        }
    }
`

const me = gql`
    query {
        me {
            id
            name
            email
        }
    }
`

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

const myPosts = gql`
    query {
        myPosts {
            id
            title
            published
        }
    }
`

const updatePost = gql`
    mutation($id: ID!, $data: UpdatePostInput!) {
        updatePost(
            id: $id
            data: $data
        ) {
            id
            title
            body
            published
        }
    }
`

const createPost = gql`
    mutation($data: CreatePostInput!) {
        createPost(
            data: $data
        ) {
            id
            title
            body
            published
        }
    }
`

const deletePost = gql`
    mutation($id: ID!) {
        deletePost(
            id: $id
        ) {
            id
            title
            published
        }
    }
`

const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment(
            id: $id
        ) {
            id
            text
        }
    }
`

const subscribeComment = gql`
    subscription($postId: ID!) {
        comment(
            postId: $postId
        ) {
            mutation
            node {
                id
                text
            }
        }
    }
`

export {
    createUser,
    getUsers,
    login,
    me,
    getPosts,
    myPosts,
    updatePost,
    createPost,
    deletePost,
    deleteComment,
    subscribeComment
}
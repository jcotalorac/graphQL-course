const users = [
    {
        id: '1',
        name: 'First',
        email: 'mail@mail',
        age: 28
    },
    {
        id: '2',
        name: 'Second',
        email: 'email@mail'
    },
    {
        id: '3',
        name: 'Third',
        email: 'em@em'
    }
]

const posts = [
    {
        id: '1',
        title: 'Title1',
        body: 'Body1',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Title2',
        body: 'Body2',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: 'Title3',
        body: 'Body3',
        published: false,
        author: '2'
    }
]

const comments = [
    {
        id: '1',
        text: 'Comment1',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Comment2',
        author: '2',
        post: '2'
    },
    {
        id: '3',
        text: 'Comment3',
        author: '3',
        post: '3'
    },
    {
        id: '4',
        text: 'Comment4',
        author: '1',
        post: '1'
    }
]

const db = {
    users,
    posts,
    comments
}

export { db as default }
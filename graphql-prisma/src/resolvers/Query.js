const Query = {
    users(parent, args, { db, prisma }, info) {
        if(!args.query) {
            return db.users
        }

        return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase())
        )
    },
    posts(parent, args, { db }, info) {
        if(!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: 123098,
            name: 'Other name',
            email: 'mail',
            age: 28
        }
    },
    post() {
        return {
            id: 'asdqw12',
            title: 'Post title',
            body: 'Post body',
            published: false
        }
    }
}

export { Query as default }
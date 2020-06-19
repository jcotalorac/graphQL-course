const Comment = {
    post(parent, args, { db }, info) {
        return db.posts.find((post) => post.id === parent.post)
    }
}

export { Comment as default }
import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid'
import db from './db'

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if(!args.query) {
                return ctx.db.users
            }

            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase())
            )
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts
            }

            return posts.filter((post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
        },
        comments(parent, args, ctx, info) {
            return comments
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
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)
            
            if(emailTaken) {
                throw new Error('Email already exists')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user);
            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if(userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = users.splice(userIndex, 1)
            
            posts = posts.filter((post) => {
                const match = post.author === args.id

                if(match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }
                return !match
            })

            comments = comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            
            posts.push(post)
            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)

            if(postIndex === -1) {
                throw new Error('Post does not exist')
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info) {
            const authorExist = users.some((user) => user.id === args.data.author)

            if(!authorExist) {
                throw new Error('The comment author does not exist')
            }

            const postExists = posts.some((post) => post.id === args.data.post && post.published)

            if(!postExists) {
                throw new Error('Post does not exist or is not published')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)
            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)

            if(commentIndex === -1) {
                throw new Error('Comment does not exist')
            }

            const deletedComments = comments.splice(commentIndex, 1)

            return deletedComments[0]
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!');
})
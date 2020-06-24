import { v4 as uuidv4 } from 'uuid'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({
            email: args.data.email
        })
        
        if(emailTaken) {
            throw new Error('Email already exists')
        }

        return await prisma.mutation.createUser({
            data: args.data
        }, info)
    },
    async deleteUser(parent, args, { prisma }, info) {
        await validateUserExistence(prisma, args)

        return await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateUser(parent, args, { prisma }, info) {
        await validateUserExistence(prisma, args)
        
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    async createPost(parent, args, { prisma, pubsub }, info) {
        args.id = args.data.author
        await validateUserExistence(prisma, args)

        const post = await prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.id
                    }
                }
            }
        }, info)
        
        if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        return post
    },
    deletePost(parent, args, { prisma, pubsub }, info) {

        const post = prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)

        if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
    },
    updatePost(parent, args, { prisma, pubsub }, info) {
        const { id, data } = args
        const post = prisma.mutation.updatePost({
            where: {
                id
            },
            data
        }, info)

        return post
    },
    createComment(parent, args, { prisma, pubsub }, info) {
        
        const comment = prisma.mutation.createComment({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
        
        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if(commentIndex === -1) {
            throw new Error('Comment does not exist')
        }

        const [ deletedComment ] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args

        const comment = db.comments.find((comment) => comment.id === args.id)

        if(!comment) {
            throw new Error('Comment does not exist')
        }

        if(typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }

async function validateUserExistence(prisma, args) {
    const userExists = await prisma.exists.User({
        id: args.id
    })

    if(!userExists) {
        throw new Error('User not found')
    }
}

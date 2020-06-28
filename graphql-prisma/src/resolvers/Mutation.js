import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({
            email: args.data.email
        })
        
        if(emailTaken) {
            throw new Error('Email already exists')
        }

        if(args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer')
        }
        const password = await bcrypt.hash(args.data.password, 10)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
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
    createComment(parent, args, { prisma }, info) {
        
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
    deleteComment(parent, args, { prisma }, info) {
        const comment = prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)

        return comment
    },
    updateComment(parent, args, { prisma }, info) {
        const { id, data } = args

        const comment = prisma.mutation.updateComment({
            data,
            where: {
                id
            }
        }, info)

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

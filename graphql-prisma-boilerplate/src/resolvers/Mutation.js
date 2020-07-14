import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({
            email: args.data.email
        })
        
        if(emailTaken) {
            throw new Error('Email already exists')
        }

        const password = await hashPassword(args.data.password)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async loginUser(parent, args, { prisma }, info) {
        
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })
        
        if(!user) {
            throw new Error('Invalid credentials')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if(!isMatch) {
            throw new Error('Invalid credentials')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return await prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if(typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    async createPost(parent, args, { prisma, pubsub, request }, info) {
        const userId = getUserId(request)
        
        const post = await prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: userId
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
    async deletePost(parent, args, { prisma, pubsub, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!postExists) {
            throw new Error('Author-post does not exist')
        }

        const post = await prisma.mutation.deletePost({
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
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!postExists) {
            throw new Error('Author-post does not exist')
        }
        
        const { id, data } = args
        const postPublished = await prisma.exists.Post({
            id,
            published: true
        })

        const post = await prisma.mutation.updatePost({
            where: {
                id
            },
            data
        }, info)
        
        if(postPublished && !data.published) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id
                    }
                }
            })
        }
        return post
    },
    async createComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })

        if(!postExists) {
            throw new Error('Post published-id does not exist')
        }
        
        const comment = await prisma.mutation.createComment({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: userId
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
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const commentExist = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!commentExist) {
            throw new Error('Author-comment does not exist')
        }

        const comment = await prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)

        return comment
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const commentExist = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!commentExist) {
            throw new Error('Author-comment does not exist')
        }

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
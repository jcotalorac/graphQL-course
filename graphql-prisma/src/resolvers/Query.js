import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const operationArgs = {}

        if(args.query) {
            operationArgs.where = {
                OR: [
                    {
                        name_contains: args.query
                    }
                ]
            }
        }        
        
        return prisma.query.users(operationArgs, info)
    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const operationArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }

        if(args.query) {
            operationArgs.where.OR = [
                {
                    title_contains: args.query
                },
                {
                    body_contains: args.query
                }
            ]
        }

        return prisma.query.posts(operationArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const operationArgs = {
            where: {
                published: true
            }
        }

        if(args.query) {
            operationArgs.where.OR = [
                {
                    title_contains: args.query
                },
                {
                    body_contains: args.query
                }
            ]
        }
        return prisma.query.posts(operationArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const operationArgs = {}

        if(args.query) {
            operationArgs.where = {
                text_contains: args.query
            }
        }

        return prisma.query.comments(operationArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [
                    {
                        published: true
                    },
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        }, info)
        
        
        if(posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    }
}

export { Query as default }
const Query = {
    users(parent, args, { prisma }, info) {
        const operationArgs = {}

        if(args.query) {
            operationArgs.where = {
                OR: [
                    {
                        name_contains: args.query
                    },
                    {
                        email_contains: args.query
                    }
                ]
            }
        }        
        
        return prisma.query.users(operationArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const operationArgs = {}

        if(args.query) {
            operationArgs.where = {
                OR: [
                    {
                        title_contains: args.query
                    },
                    {
                        body_contains: args.query
                    }
                ]
            }
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
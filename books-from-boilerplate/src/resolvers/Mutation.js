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
    }
}

export { Mutation as default }
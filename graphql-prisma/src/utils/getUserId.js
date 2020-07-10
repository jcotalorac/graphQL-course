import jwt from 'jsonwebtoken'

const getUserId = (request, requiredAuth = true) => {
    
    const headerAuth = request.request ? request.request.headers.authorization : request.connection.context.Authorization

    if(headerAuth) {
        const token = headerAuth.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
        return decoded.userId
    }
    
    if(requiredAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export { getUserId as default }
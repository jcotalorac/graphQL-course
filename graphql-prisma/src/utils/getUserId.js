import jwt from 'jsonwebtoken'

const getUserId = (request, requiredAuth = true) => {
    
    const headerAuth = request.request.headers.authorization

    if(headerAuth) {
        const token = headerAuth.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisasecret')
    
        return decoded.userId
    }
    
    if(requiredAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export { getUserId as default }
import jwt from 'jsonwebtoken'

const getUserId = (request, requiredAuth = true) => {
    
    const headerAuth = request.request.headers.authorization

    if(headerAuth) {
        const token = headerAuth.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisasecret')
    
        return decoded.userId
    }
    
    throw new Error('Authentication required')
}

export { getUserId as default }
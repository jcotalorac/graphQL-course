import jwt from 'jsonwebtoken'

const getUserId = (request) => {
    
    const headerAuth = request.request.headers.authorization

    if(!headerAuth) {
        throw new Error('Authentication required')
    }

    const token = headerAuth.replace('Bearer ', '')
    const decoded = jwt.verify(token, 'thisisasecret')

    return decoded.userId
}

export { getUserId as default }
import jwt from 'jsonwebtoken'

const expirationTime = '7d'
const generateToken = async (user) => 
    jwt.sign({ userId: user.id }, 'thisisasecret', { expiresIn: expirationTime })

export { generateToken as default }
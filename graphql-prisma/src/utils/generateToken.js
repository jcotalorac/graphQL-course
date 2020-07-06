import jwt from 'jsonwebtoken'

const expirationTime = '7d'
const generateToken = async (userId) => 
    jwt.sign({ userId }, 'thisisasecret', { expiresIn: expirationTime })

export { generateToken as default }
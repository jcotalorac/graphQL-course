import jwt from 'jsonwebtoken'

const expirationTime = '7d'
const generateToken = async (userId) => 
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: expirationTime })

export { generateToken as default }
require('babel-register')
require('@babel/polyfill')
const server = require('../../src/server').default

module.exports = async () => {
    global.httpServer = await server.start({ port: process.env.PORT || 4000 }, ({ port }) => {
        console.log('The server is up on port ' + port + '!')
    })
}
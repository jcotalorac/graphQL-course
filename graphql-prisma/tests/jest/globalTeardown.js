module.exports = async () => {
    await global.httpServer.close(() => console.log('Shutting down server'))
}
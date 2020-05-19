const message = 'This is a message from myModule'
const name = 'Example name'
const location = 'Location value'

const greeting = (name) => {
    return `Greeting ${name}`
}

export { message, name, greeting, location as default }
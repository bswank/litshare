const mongoose = require('mongoose')

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' })

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE, { useMongoClient: true })
mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🔥  DATABASE ERROR: ${err.message}\n`)
})

// READY?! Let's go!

// Import models so MongoDB knows about them
require('./models/Community')
require('./models/User')
require('./models/Library')
require('./models/Book')

// Start our app!
const app = require('./app')
app.set('port', process.env.PORT || 7777)
const server = app.listen(app.get('port'), () => {
  console.log(`\n\nExpress app runnning on port ${server.address().port}. No errors! 🎉\n`)
})

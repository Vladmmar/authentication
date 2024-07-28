const express = require('express')
const app = express()
const query = require('./datareq')
const verifyToken = require('./middleware/verifyToken')
const auth = require('./routes/auth')
const api = require('./routes/api')
const path = require('path')
const cookieParser = require('cookie-parser')

require('dotenv').config({
    override: true,
    path: path.resolve(__dirname, 'secret.env')
})

app.use(cookieParser())
app.use(express.json())
app.use(verifyToken)
app.use('/auth', auth)
app.use('/api', api)
app.use(express.static('./public'))

app.get('/', (req, res) => {
    if(!req.cookies['x-auth-token']){
        return res.status(200).send('You are not signed in. <a href="/login">Log in</a> or <a href="/signup">Sign up</a>')
    }
    res.send("<a href='/profile'>Visit your profile page</a>")
})

app.get('/login', (req, res) => {
    //CHECK IF USER IS ALREADY LOGGED IN
    if(req.cookies['x-auth-token']){
        return res.status(200).sendFile(path.resolve(__dirname, 'src', 'login', 'logged.html'))
    }
    res.status(200).sendFile(path.resolve(__dirname, 'src', 'login', 'index.html'))
})

app.get('/signup', (req, res) => {
    //CHECK IF USER IS ALREADY LOGGED IN
    if(req.cookies['x-auth-token']){
        return res.status(200).sendFile(path.resolve(__dirname, 'src', 'signup', 'logged.html'))
    }
    res.status(200).sendFile(path.resolve(__dirname, 'src', 'signup', 'index.html'))
})

app.get('/profile', (req, res) => {
    if(!req.cookies['x-auth-token']){
        return res.status(401).sendFile(path.resolve(__dirname, 'src', 'profile', 'notlogged.html'))
    }
    res.status(200).sendFile(path.resolve(__dirname, 'src', 'profile', 'index.html'))
})

const PORT = process.env.PORT || 1010
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
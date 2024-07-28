const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const query = require('../datareq')
const JWT = require('jsonwebtoken')

app.use(cookieParser())

module.exports = async (req, res, next) => {
    if(req.cookies['x-auth-token']){
        const sessionToken = req.cookies['x-auth-token']
        const verify = JWT.verify(sessionToken, process.env.SECRET)
        if(!verify){
            res.status(400).json({
                "errors": [
                    {
                        "msg": "Token not valid"
                    }
                ]
            })
        }
        const token = await query(`SELECT * FROM tokens WHERE token = '${sessionToken}'`)
        if(token.length !== 1){
            res.clearCookie('x-auth-token')
            next()
        }
    }
    next()
}
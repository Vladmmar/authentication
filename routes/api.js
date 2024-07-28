const router = require('express').Router()
const cookieParser = require('cookie-parser')
const query = require('../datareq')

router.use(cookieParser())

router.get('/profile', (req, res, next) => {
    if(!req.cookies['x-auth-token']){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "You are not logged in"
                }
            ]
        })
    }
    next()
}, async (req, res) => {
    const sessionToken = req.cookies['x-auth-token']
    const user = (await query(`SELECT first_name, last_name, email, date_of_birth, date_of_registration FROM users WHERE user_uuid = (SELECT user_uuid FROM tokens WHERE token = '${sessionToken}')`))[0]
    if(!user){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "User not found"
                }
            ]
        })
    }
    res.json(user)
})
    
module.exports = router;
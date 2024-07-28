const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const JWT = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const query = require('../datareq')
const bcrypt = require('bcrypt')
const path = require('path')

router.use(cookieParser())

//SIGN-UP
router.post('/signup', [
    check("email", 'Please provide valid email')
        .isEmail(),
    check("password", 'Password should be longer than 8 characters and shorter than 70')
        .isLength({
            min: 8,
            max: 70
        })
], async (req, res) => {
    const { first_name, last_name, email, password, date_of_birth } = req.body

    if(req.cookies['x-auth-token']){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "You are already logged in"
                }
            ]
        })
    }

    //VALIDATE INPUT
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            "errors": errors.array()
        })
    }
    
    //CHECK IF USER ALREADY EXISTS
    const user = await query(`SELECT * FROM users WHERE email = '${email}'`)
    if(user.length !== 0){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "User already exists"
                }
            ]
        })
    }

    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10)
    //CREATE NEW USER
    await query(`INSERT INTO users(first_name, last_name, email, password, date_of_birth) VALUES('${first_name}', '${last_name}', '${email}', '${hashedPassword}', '${date_of_birth}')`)
    //CREATE AND GIVE A USER TOKEN
    let uuid = await query(`SELECT user_uuid FROM users WHERE email = '${email}'`)
    uuid = uuid[0]["user_uuid"]
    const token = await JWT.sign(
        {uuid}, 
        process.env.SECRET,
        {expiresIn: 3600000})
    await query(`INSERT INTO tokens(user_uuid, token) VALUES('${uuid}', '${token}')`)
    res.cookie("x-auth-token", token, {httpOnly: true})

    res.status(200).json({success: true})
})

//LOGIN
router.post('/login', [
    check('email', 'Provide a valid email')
        .isEmail(),
    check('password', 'Password should be longer that 8 characters and shorter than 70')
        .isLength({
            min: 8,
            max: 70
        })
], async (req, res) => {
    const { email, password } = req.body;

    if(req.cookies['x-auth-token']){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "You are already logged in"
                }
            ]
        })
    }

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            "errors": errors.array()
        })
    }

    let user = await query(`SELECT * FROM users WHERE email = '${email}'`)
    user = user[0]

    if(!user){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "User not found"
                }
            ]
        })
    }

    const authentified = await bcrypt.compare(password, user.password)  
    
    if(!authentified){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Incorrect password"
                }
            ]
        })
    }
    const uuid = user["user_uuid"]
    const token = JWT.sign(
        {uuid},
        process.env.SECRET,
        {expiresIn: 3600000})   

    await query(`INSERT INTO tokens(user_uuid, token) VALUES('${uuid}', '${token}')`)

    res.cookie('x-auth-token', token)
    res.status(200).json({
        "success": "true"
    })
})

router.post('/logout', async (req, res) => {

    if(req.cookies['x-auth-token']){
        const token = req.cookies['x-auth-token']
        res.clearCookie('x-auth-token')
        await query(`DELETE FROM tokens WHERE token = '${token}'`)
    } else{
        return res.status(400).json({
            "errors": [
                {
                    "msg": "You are not logged in"
                }
            ]
        })
    }

    return res.status(200).json({
        "success": "true"
    })
})

module.exports = router
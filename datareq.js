const path = require('path')
require('dotenv').config({
    override: true,
    path: path.resolve(__dirname, "development.env")
})
const { Pool, Client } = require('pg')

const pool = new Pool({
    host: process.env.DBHOST,
    port: process.env.DBPOST,
    database: process.env.DATABASE,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
})

module.exports = async (query) => {
    const client = await pool.connect()
    try {
        const { rows } = await client.query(query)
        return rows 
    } catch (error) {
        console.log(error)
    } finally{
        client.release()
    }
}
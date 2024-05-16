import express from "express"
import { createPool } from "mysql2/promise"
import { config } from "dotenv"


const app = express()

console.log({
    host: process.env.MYSQLDB_HOST,
    user:'root',
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,




})

const pool = createPool({
    host: "mysqldb",
    user: "root",
    password: "123456",
    port: 3306
})

app.get("/", (req, res)=>{
    res.send("helloword")
})

app.get("/ping", async(req, res)=>{
    const result = await pool.query("SELECT NOW()")
    res.json(result[0])
})

app.listen(3000)
console.log("Corriendo")

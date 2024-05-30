import express from "express"
import { createPool } from "mysql2/promise"
import { config } from "dotenv"

//inicializacion
const app = express()

//Configuracion
app.set('port', process.env.PORT || 3000);

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

//configuracion de pug
app.set('views', './vistas')
app.set('view engine', 'pug')

//configuracion de archivos estaticos
app.use(express.static('./vistas'))
app.use(express.static('./src'))
app.use(express.static('./css'))


app.get("/", (req, res)=>{
    //res.send("helloword")}
    res.render('index')
})

app.get("/ping", async(req, res)=>{
    const result = await pool.query("SELECT NOW()")
    res.json(result[0])
})

//Run server
app.listen(app.get('port'), () =>
    console.log('Servidor escuchando en puerto ', app.get('port')));
console.log("Corriendo")

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
app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", (req, res)=>{
    //res.send("helloword")}
    res.render('register');
});

app.post("/validar",(req, res)=>{
    const datos = req.body

    console.log(datos);
    let gmail = datos.gmail;
    let contraseña = datos.contraseña;

    let register = "INSERT INTO tabla_usuario(Gamil, Contraseña) VALUES ('"+gmail+"', '"+contraseña+"')";
    pool.query(register, function(error){
        if (error){
            throw error;
        }else {
            console.log("Datos guardados correctamete")
        }
    })  
});


app.get("/ping", async(req, res)=>{
    const result = await pool.query("SELECT NOW()")
    res.json(result[0])
})

//Run server
app.listen(app.get('port'), () =>
    console.log('Servidor escuchando en puerto ', app.get('port')));
console.log("Corriendo")

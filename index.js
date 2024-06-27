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

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/register",(req, res)=>{
    const datos = req.body

    console.log(datos);
    let gmail = datos.gmail;
    let contraseña = datos.contraseña;

    let buscar = "SELECT * FROM tabla_usuario WHERE Gmail = "+gmail+"";
    conexion.query(buscar, function(error, row){
        if (error){
            throw error;
        }else {
            if (row.length>0){
                console.log("No se puede registrar usuario ya existe")
            }else{
                let register = "INSERT INTO tabla_usuario(Gamil, Contraseña) VALUES ('"+gmail+"', '"+contraseña+"')";
                pool.query(register, function(error){
                    if (error){
                        throw error;
                    }else {
                        console.log("Datos guardados correctamete")
                    }
                });
                
            }
        }
    })

  
});

app.post('/login', async (req, res) => {
    const { gmail, contraseña } = req.body;
    try {
        // Buscar el usuario por su Gmail
        const [rows] = await pool.query('SELECT * FROM tabla_usuario WHERE Gmail = ?', [gmail]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const user = rows[0];

        // Comparar la contraseña encriptada
        const isMatch = await bcrypt.compare(contraseña, user.Contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

app.get("/ping", async(req, res)=>{
    const result = await pool.query("SELECT NOW()")
    res.json(result[0])
})

//Run server
app.listen(app.get('port'), () =>
    console.log('Servidor escuchando en puerto ', app.get('port')));
console.log("Corriendo")

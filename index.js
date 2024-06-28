import express from "express"
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from "dotenv"

//inicializacion
const app = express()

//Configuracion
app.set('port', process.env.PORT || 3000);

config();

//
const database = process.env.DATABASE_NAME
console.log(database)
const username = process.env.DATABASE_USERNAME
console.log(username)
const password = process.env.DATABASE_PASSWORD
console.log(password)
const host = process.env.DATABASE_HOST
console.log(host)
const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        dialect: 'mysql',
        host: host
    });

    class Usuario extends Model { }
    Usuario.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, { sequelize, modelName: 'usuario' });

sequelize.sync();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
    const users = await Usuario.findAll();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await Usuario.findByPk(req.params.id);
    res.json(user);
});

app.post('/users', async (req, res) => {
    const user = await Usuario.create(req.body);
    res.json(user);
});

app.put('/users/:id', async (req, res) => {
    const user = await Usuario.findByPk(req.params.id);
    if (user) {
        await user.update(req.body);
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const user = await Usuario.findByPk(req.params.id);
    if (user) {
        await user.destroy();
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
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


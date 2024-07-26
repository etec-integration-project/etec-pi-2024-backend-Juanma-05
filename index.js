import express from "express"
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from "dotenv"
import cors from 'cors';


//inicializacion
const app = express()

app.set('view engine', 'ejs');
app.use(cors());


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

    class Productos extends Model { }
    Productos.init({
        product: DataTypes.STRING,
        url: DataTypes.STRING,
    }, { sequelize, modelName: 'productos' });


sequelize.sync();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
    const users = await Usuario.findAll();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const user = await Usuario.create(req.body);
    res.json(user);
});

app.post('/products', async (req, res) => {
    const product = await Productos.create(req.body);
    res.json(product);
});


app.get('/login', (req, res) => {
    res.render('login');
});

// Renderizar página de registro
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // si el correo electrónico ya está registrado
        const existingUser = await Usuario.findOne({ where: { email } });
        
        if (existingUser) {
            // Si el correo ya está registrado, mostrar mensaje de error
            return res.render('register', { error: 'Este correo electrónico ya está registrado' });
        }
         
        const newUser = await Usuario.create({ name, email, password });
        res.redirect('/login'); 
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send('Error interno del servidor');
    }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Usuario.findOne({ where: { email, password } });
        
        if (user) {
            res.redirect('/inicio'); 
        } else {
            res.render('login', { error: 'Credenciales inválidas, intente de nuevo'});
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(app.get('port'), () =>
console.log('Servidor escuchando en puerto ', app.get('port')));
console.log("Corriendo")

// app.get('/users/:id', async (req, res) => {
    //     const user = await Usuario.findByPk(req.params.id);
    //     res.json(user);
    // });
    
    
    
    // app.put('/users/:id', async (req, res) => {
        //     const user = await Usuario.findByPk(req.params.id);
        //     if (user) {
            //         await user.update(req.body);
            //         res.json(user);
            //     } else {
                //         res.status(404).json({ message: 'User not found' });
                //     }
                // });
                
    // app.delete('/users/:id', async (req, res) => {
    //     const user = await Usuario.findByPk(req.params.id);
    //     if (user) {
    //         await user.destroy();
    //         res.json({ message: 'User deleted' });
    //     } else {
    //         res.status(404).json({ message: 'User not found' });
    //     }
    // });
                


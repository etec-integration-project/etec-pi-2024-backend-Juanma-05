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
app.set('port', process.env.PORT || 3001);

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
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, { sequelize, modelName: 'usuario' });

    class Productos extends Model { }
    Productos.init({
        product: DataTypes.STRING,
        price: DataTypes.FLOAT,
        suela: DataTypes.STRING,
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
    const { product, url } = req.body; // Desestructura los campos necesarios

    try {
        // Verifica si ya existe un producto con el mismo nombre o URL
        const existingProduct = await Productos.findOne({
            where: {
                [Sequelize.Op.or]: [{ product: product }, { url: url }]
            }
        });

        if (existingProduct) {
            // Si ya existe, retorna un mensaje de error
            return res.status(409).json({ error: 'Ya existe un producto con este nombre o URL' });
        }

        // Si no existe, crea el nuevo producto
        const newProduct = await Productos.create(req.body);
        res.status(201).json(newProduct); // Retorna el nuevo producto con un estado 201 (creado)
    } catch (error) {
        console.error('Error al crear el producto:', error); // Para depurar errores
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
});


app.get('/products', async (req, res) => {

    const products = await Productos.findAll();
    res.json(products);
});

app.delete('/delete', async (req, res) => {
    const { id } = req.body; // Asegúrate de recibir el ID del cuerpo de la solicitud

    try {
        const deletedProduct = await Productos.destroy({
            where: { id: id } // Elimina el producto basado en el ID recibido
        });

        if (deletedProduct) {
            return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } else {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});



app.get('/login', (req, res) => {
    res.render('login');
});

// Renderizar página de registro
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Verifica si el correo electrónico ya está registrado
        const existingUser = await Usuario.findOne({ where: { email } });
        
        if (existingUser) {
            // Si el correo ya está registrado, enviar un mensaje de error en formato JSON
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
        }
        
        // Crea un nuevo usuario
        const newUser = await Usuario.create({ email, password });
        res.status(200).json({ message: 'Registro exitoso' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica si el correo electrónico está registrado
        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            // Si el usuario no existe, enviar un mensaje de error
            return res.status(400).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        // Verifica la contraseña (esto es solo un ejemplo, deberías usar hashing en producción)
        if (user.password !== password) {
            return res.status(400).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        // Iniciar sesión exitoso
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.listen(app.get('port'), () =>
console.log('Servidor escuchando en puerto ', app.get('port')));
console.log("Corriendo")


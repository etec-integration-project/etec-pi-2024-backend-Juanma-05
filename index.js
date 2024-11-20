import express from "express";
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from "dotenv";
import cors from 'cors';


// Inicialización
const app = express();
app.set('view engine', 'ejs');
app.use(cors());

// Configuración
app.set('port', process.env.PORT || 3001);
config();

const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        dialect: 'mysql',
        host: host
    }
);

class Usuario extends Model { }
Usuario.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
}, { sequelize, modelName: 'usuario' });

// Corrección aquí: elimina la duplicación de `Carrito` y usa `Producto`
class Producto extends Model { }
Producto.init({
    product: DataTypes.STRING,
    price: DataTypes.FLOAT,
    suela: DataTypes.STRING,
    url: DataTypes.STRING,
}, { sequelize, modelName: 'producto' });

// Mantenemos solo una definición de `Carrito`
class Carrito extends Model { }
Carrito.init({
    product: DataTypes.STRING,
    price: DataTypes.FLOAT,
    suela: DataTypes.STRING,
    url: DataTypes.STRING,
}, { sequelize, modelName: 'carrito' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/users', async (req, res) => {
    const users = await Usuario.findAll();
    res.json(users);
});

app.post('/api/users', async (req, res) => {
    const user = await Usuario.create(req.body);
    res.json(user);
});

app.post('/api/products', async (req, res) => {
    const { product, url } = req.body;

    try {
        const existingProduct = await Producto.findOne({
            where: {
                [Sequelize.Op.or]: [{ product: product }, { url: url }]
            }
        });

        if (existingProduct) {
            return res.status(409).json({ error: 'Ya existe un producto con este nombre o URL' });
        }

        const newProduct = await Producto.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
});

app.get('/api/products', async (req, res) => {
    const products = await Producto.findAll();
    res.json(products);
});

app.post('/api/carrito', async (req, res) => {
    const { id, product, url, price, suela } = req.body;

    try {
        let existingProduct = await Carrito.findOne({
            where: { product: product }
        });

        if (existingProduct) {
            existingProduct.cantidad += 1;
            await existingProduct.save();
            return res.status(200).json(existingProduct);
        }

        const newProduct = await Carrito.create({ ...req.body, cantidad: 1 });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito.' });
    }
});

app.get('/api/carrito', async (req, res) => {
    const carrito = await Carrito.findAll();
    res.json(carrito);
});

app.delete('/api/delete', async (req, res) => {
    const { id } = req.body;

    try {
        const deletedProduct = await Producto.destroy({
            where: { id: id }
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

app.delete('/api/deleteCarrito', async (req, res) => {
    const { id } = req.body;

    try {
        const deletedProduct = await Carrito.destroy({
            where: { id: id }
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

app.get('/api/login', (req, res) => {
    res.render('login');
});

app.get('/api/register', (req, res) => {
    res.render('register');
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await Usuario.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
        }

        const newUser = await Usuario.create({ email, password });
        res.status(200).json({ message: 'Registro exitoso' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Correo electrónico no registrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.listen(app.get('port'), () => console.log('Servidor escuchando en puerto ', app.get('port')));

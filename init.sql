-- Crear la tabla 'Ids' para generar IDs autoincrementales
CREATE TABLE Id (
    id INT AUTO_INCREMENT PRIMARY KEY
);

-- Crear la tabla 'Productos'
CREATE TABLE Productos (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion TEXT
);

-- Crear la tabla 'Precios'
CREATE TABLE Precios (
    producto_id INT NOT NULL,
    precio DECIMAL(10,2),
    FOREIGN KEY (producto_id) REFERENCES Productos(id)
);

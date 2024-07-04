const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para procesar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Se requieren username y password.' });
    }

    // Leer usuarios existentes
    const usersPath = path.join(__dirname, 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

    // Verificar si el usuario ya existe
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Agregar nuevo usuario
    const newUser = { username, password };
    users.push(newUser);

    // Guardar usuarios actualizados en el archivo JSON
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    res.json({ message: 'Usuario registrado correctamente.' });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Se requieren username y password.' });
    }

    // Leer usuarios existentes
    const usersPath = path.join(__dirname, 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

    // Verificar credenciales
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    res.json({ message: 'Inicio de sesión exitoso.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

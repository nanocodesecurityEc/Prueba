const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors"); // Importa el paquete cors
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Configura CORS para permitir todas las solicitudes
app.use(cors());

const USERS_FILE = "users.json";

// Función auxiliar para leer usuarios desde el archivo JSON
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Función auxiliar para escribir usuarios en el archivo JSON
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Ruta para registrar un nuevo usuario
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Se requiere nombre de usuario y contraseña" });
  }

  let users = readUsers();

  // Verificar si el usuario ya existe
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Agregar el nuevo usuario
  users.push({ username, password });
  writeUsers(users);

  res.status(201).json({ message: "Usuario registrado exitosamente" });
});

// Ruta para iniciar sesión
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Se requiere nombre de usuario y contraseña" });
  }

  let users = readUsers();

  // Verificar si el usuario existe y la contraseña es correcta
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  res.status(200).json({ message: "Inicio de sesión exitoso" });
});

// Ruta para obtener todos los usuarios
app.get("/users", (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

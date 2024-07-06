import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.includes("@")) {
      setMessage('El correo debe contener el símbolo "@"');
      return;
    }
    if (password.length > 6) {
      setMessage("La contraseña no debe exceder los 6 caracteres");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Correo electrónico"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;

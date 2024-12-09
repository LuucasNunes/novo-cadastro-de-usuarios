import axios from "axios";

//Criando conexão com Servidor
const api = axios.create({
  baseURL: "http://localhost:3000",
});

export default api;
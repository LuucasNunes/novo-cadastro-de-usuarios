import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/trash.svg";
import api from "../../services/api";
import Modal from "../../components/Modal/modal";

function Home() {
  const [users, setUsers] = useState([]);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, message: "", status: "success" });

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  function openModal(message, status) {
    setModalConfig({ isOpen: true, message, status });
  }

  function closeModal() {
    setModalConfig({ isOpen: false, message: "", status: "success" });
  }

  async function getUsers() {
    try {
      const apiUsers = await api.get("/users");
      setUsers(apiUsers.data.reverse());
    } catch (error) {
      openModal("Erro ao obter usuários. Tente novamente.", "error");
    }
  }

  async function createUsers() {
    try {
      await api.post("/users", {
        name: inputName.current.value,
        age: parseInt(inputAge.current.value),
        email: inputEmail.current.value,
      });
      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";

      getUsers();
      openModal("Usuário criado com sucesso!", "success");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        openModal("Esse email já está em uso. Tente outro email!", "error");
      } else {
        openModal("Ocorreu um erro ao criar o usuário. Tente novamente.", "error");
      }
    }
  }

  async function deleteUser(id) {
    try {
      await api.delete(`/users/${id}`);
      getUsers();
      openModal(`Usuário com ID ${id} excluído com sucesso.`, "success");
    } catch (error) {
      openModal("Erro ao excluir o usuário. Tente novamente.", "error");
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        message={modalConfig.message}
        status={modalConfig.status}
      />
      <form>
        <h1>Cadastro de Usuários</h1>
        <input
          name="nome"
          placeholder="Digite seu nome"
          ref={inputName}
          type="text"
        />
        <input
          name="idade"
          placeholder="Digite sua idade"
          ref={inputAge}
          type="number"
          min="0"
        />
        <input
          name="email"
          placeholder="Digite seu email"
          ref={inputEmail}
          type="email"
        />
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>
      {users.map((user) => (
        <div key={user.id} className="card-users">
          <div>
            <p>
              Nome: <span> {user.name} </span>
            </p>
            <p>
              Idade: <span> {user.age} </span>
            </p>
            <p>
              Email: <span> {user.email}</span>
            </p>
            <p>
              Status: <span>{user.status}</span>
            </p>
          </div>
          <button>
            <img src={Trash} onClick={() => deleteUser(user.id)} alt="Delete" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;

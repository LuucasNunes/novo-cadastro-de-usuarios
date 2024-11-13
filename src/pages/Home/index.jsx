import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/trash.svg";
import api from "../../services/api";
import Modal from "../../components/Modal/modal";

function Home() {
  const [users, setUsers] = useState([]);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  function openErrorModal(message) {
    setErrorModal({ isOpen: true, message });
  }

  function closeErrorModal() {
    setErrorModal({ isOpen: false, message: "" });
  }

  async function getUsers() {
    try {
      const apiUsers = await api.get("/users");
      setUsers(apiUsers.data.reverse());
    } catch (error) {
      openErrorModal("Erro ao obter usuários. Tente novamente.");
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
    } catch (error) {
      if (error.response && error.response.status === 409) {
        openErrorModal("Esse email já está em uso. Tente outro email!");
      } else {
        openErrorModal("Ocorreu um erro ao criar o usuário. Tente novamente.");
      }
    }
  }

  async function deleteUser(id) {
    try {
      await api.delete(`/users/${id}`);
      console.log(`Usuário com ID ${id} excluído com sucesso.`);
      getUsers();
    } catch (error) {
      openErrorModal("Erro ao excluir o usuário. Tente novamente.");
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <Modal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        message={errorModal.message}
      />
      <form>
        <h1>Cadastro de Usuários</h1>
        <input
          name="nome"
          placeholder="Digite seu nome"
          ref={inputName}
          type="text"
        ></input>
        <input
          name="idade"
          placeholder="Digite sua idade"
          ref={inputAge}
          type="number"
          min="0"
        ></input>
        <input
          name="email"
          placeholder="Digite seu email"
          ref={inputEmail}
          type="email"
        ></input>
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
            <img src={Trash} onClick={() => deleteUser(user.id)} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;

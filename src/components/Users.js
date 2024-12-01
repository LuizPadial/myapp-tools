import React from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      showModal: false,
      selectedUserId: null,
      selectedUser: null,
      modalType: "", // "edit" ou "delete"
      searchQuery: "",
      notFound: false,
    };
  }

  componentDidMount() {
    this.buscarUsuario();
  }

  buscarUsuario = () => {
    fetch("http://localhost:8080/users")
      .then((resposta) => resposta.json())
      .then((dados) => {
        this.setState({ usuarios: dados, notFound: false });
      })
      .catch((error) => {
        console.error("Erro ao carregar usuários:", error);
      });
  };

  buscarPorNomeOuMatricula = () => {
    const { searchQuery } = this.state;
    if (searchQuery === "") {
      this.buscarUsuario();
    } else {
      fetch(`http://localhost:8080/users/search?query=${searchQuery}`)
        .then((resposta) => {
          if (resposta.status === 204) {
            this.setState({ notFound: true, usuarios: [] });
          } else if (resposta.ok) {
            return resposta.json();
          } else {
            throw new Error("Erro ao buscar usuários");
          }
        })
        .then((dados) => {
          if (dados) {
            this.setState({ usuarios: dados, notFound: false });
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar usuários:", error);
        });
    }
  };

  abrirModal = (type, userId) => {
    const selectedUser = this.state.usuarios.find((user) => user.id === userId);
    this.setState({
      showModal: true,
      modalType: type,
      selectedUserId: userId,
      selectedUser: type === "edit" ? selectedUser : null,
    });
  };

  fecharModal = () => {
    this.setState({
      showModal: false,
      selectedUserId: null,
      selectedUser: null,
      modalType: "",
    });
  };

  atualizarUsuario = () => {
    const { selectedUserId, selectedUser } = this.state;

    fetch(`http://localhost:8080/users/${selectedUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedUser),
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarUsuario();
          this.fecharModal();
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar o usuário:", error);
      });
  };

  deletarUsuario = () => {
    const { selectedUserId } = this.state;

    fetch(`http://localhost:8080/users/${selectedUserId}`, {
      method: "DELETE",
    })
      .then((resposta) => {
        if (resposta.ok) {
          this.buscarUsuario();
          this.fecharModal();
        } else {
          console.error("Erro ao deletar o usuário");
        }
      })
      .catch((error) => {
        console.error("Erro ao deletar o usuário:", error);
      });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      selectedUser: {
        ...prevState.selectedUser,
        [name]: value,
      },
    }));
  };

  render() {
    const { usuarios, showModal, modalType, selectedUser, notFound } =
      this.state;

    return (
      <div>
        <h1>Buscar usuário por matrícula ou nome</h1>
        <Form>
          <Form.Group controlId="searchQuery" className="search-label">
            <Form.Control
              type="text"
              placeholder="Digite o nome ou matrícula do usuário"
              value={this.state.searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
              onKeyUp={this.buscarPorNomeOuMatricula}
            />
          </Form.Group>
        </Form>

        {notFound && (
          <Alert variant="danger">Usuário não encontrado!</Alert>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id-Cadastro</th>
              <th>Usuário</th>
              <th>Matrícula</th>
              <th>Biometria</th>
              <th>Admin</th>
              <th>Login</th>
              <th>Senha</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.registration}</td>
                <td>{user.biometricData}</td>
                <td>{user.manager ? "Sim" : "Não"}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => this.abrirModal("edit", user.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => this.abrirModal("delete", user.id)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={this.fecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "edit" ? "Editar Usuário" : "Excluir Usuário"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === "edit" ? (
              selectedUser && (
                <Form>
                  <Form.Group controlId="manager">
                    <Form.Label>Usuário Admin:</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="manager"
                      checked={selectedUser.manager}
                      onChange={(e) =>
                        this.handleInputChange({
                          target: { name: "manager", value: e.target.checked },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="name">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={selectedUser.name}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="registration">
                    <Form.Label>Matrícula</Form.Label>
                    <Form.Control
                      type="text"
                      name="registration"
                      value={selectedUser.registration}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="biometricData">
                    <Form.Label>Biometria</Form.Label>
                    <Form.Control
                      type="text"
                      name="biometricData"
                      value={selectedUser.biometricData}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="username">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={selectedUser.username}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={selectedUser.password}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                </Form>
              )
            ) : (
              <p>Tem certeza de que deseja excluir este usuário?</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharModal}>
              Cancelar
            </Button>
            {modalType === "edit" ? (
              <Button variant="primary" onClick={this.atualizarUsuario}>
                Salvar alterações
              </Button>
            ) : (
              <Button variant="danger" onClick={this.deletarUsuario}>
                Confirmar exclusão
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Users;

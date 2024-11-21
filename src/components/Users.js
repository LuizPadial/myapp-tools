import React from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      showModal: false,
      selectedUserId: null,
      selectedUser: null,  // Novo estado para armazenar os dados do usuário selecionado
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
            this.setState({ notFound: true });
            this.setState({ usuarios: [] });
          } else if (resposta.ok) {
            return resposta.json();
          } else {
            throw new Error('Erro ao buscar usuários');
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

  abrirModal = (userId) => {
    const selectedUser = this.state.usuarios.find(user => user.id === userId);
    this.setState({ showModal: true, selectedUserId: userId, selectedUser: selectedUser });
  };

  fecharModal = () => {
    this.setState({ showModal: false, selectedUserId: null, selectedUser: null });
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
          this.fecharModal();  // Fechar o modal após a atualização
        }
      })
      .catch((error) => {
        console.error("Erro ao atualizar o usuário:", error);
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

        {this.state.notFound && (
          <Alert variant="danger">Usuário não encontrado!</Alert>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id-Cadastro</th>
              <th>Usuário</th>
              <th>Matricula</th>
              <th>Biometria</th>
              <th>Admin</th>
              <th>Login</th>
              <th>Senha</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {this.state.usuarios.map((user) => (
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
                    onClick={() => this.abrirModal(user.id)} // Corrigido para chamar a função certa
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => this.abrirModal(user.id)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para edição */}
        <Modal show={this.state.showModal} onHide={this.fecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.selectedUser && (
              <Form>
                <Form.Group controlId="name">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={this.state.selectedUser.name}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="registration">
                  <Form.Label>Matrícula</Form.Label>
                  <Form.Control
                    type="text"
                    name="registration"
                    value={this.state.selectedUser.registration}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="biometricData">
                  <Form.Label>Biometria</Form.Label>
                  <Form.Control
                    type="text"
                    name="biometricData"
                    value={this.state.selectedUser.biometricData}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="manager">
                  <Form.Label>Admin</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="manager"
                    checked={this.state.selectedUser.manager}
                    onChange={(e) =>
                      this.handleInputChange({
                        target: { name: "manager", value: e.target.checked },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="username">
                  <Form.Label>Login</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={this.state.selectedUser.username}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={this.state.selectedUser.password}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.fecharModal}>
              Fechar
            </Button>
            <Button variant="primary" onClick={this.atualizarUsuario}>
              Salvar alterações
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Users;

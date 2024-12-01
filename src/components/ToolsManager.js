import React from "react";
import { Table, Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";

class ToolsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: [],
      searchQuery: "",
      showModal: false,
      modalType: "",
      selectedTool: null,
      formData: {
        name: "",
        description: "",
        available: false,
      },
      toolHistory: null, // Para armazenar o histórico de empréstimos
    };
  }

  componentDidMount() {
    this.fetchTools();
  }

  fetchTools = () => {
    const { searchQuery } = this.state;
    let url = "http://localhost:8080/ferramentas";

    if (searchQuery) {
      url = `http://localhost:8080/ferramentas/search?query=${searchQuery}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar ferramentas");
        }
        return response.json();
      })
      .then((data) => this.setState({ tools: Array.isArray(data) ? data : [] }))
      .catch((error) => console.error("Erro ao carregar ferramentas:", error));
  };

  fetchToolHistory = (toolId) => {
    fetch(`http://localhost:8080/assignments/${toolId}`)
      .then((response) => response.json())
      .then((data) => this.setState({ toolHistory: data }))
      .catch((error) => console.error("Erro ao carregar histórico de empréstimos:", error));
  };

  openModal = (type, tool = null) => {
    this.setState({
      showModal: true,
      modalType: type,
      selectedTool: tool,
      formData: tool || { name: "", description: "", available: false },
      toolHistory: null, // Limpar o histórico ao abrir o modal
    });

    if (type === "history" && tool) {
      this.fetchToolHistory(tool.id); // Buscar histórico quando abrir o modal de histórico
    }
  };

  closeModal = () => {
    this.setState({ showModal: false, selectedTool: null, toolHistory: null });
  };

  handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  handleSubmit = () => {
    const { modalType, formData, selectedTool } = this.state;
    const url =
      modalType === "create"
        ? "http://localhost:8080/ferramentas"
        : `http://localhost:8080/ferramentas/${selectedTool.id}`;
    const method = modalType === "create" ? "POST" : "PUT";

    if (!formData.name || !formData.description) {
      alert("Todos os campos precisam ser preenchidos!");
      return;
    }

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          this.fetchTools();
          this.closeModal();
        } else {
          alert("Erro ao salvar ferramenta.");
        }
      })
      .catch((error) => console.error("Erro ao salvar ferramenta:", error));
  };

  handleDelete = () => {
    const { selectedTool } = this.state;

    fetch(`http://localhost:8080/ferramentas/${selectedTool.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          this.fetchTools();
          this.closeModal();
        } else {
          alert("Erro ao deletar ferramenta.");
        }
      })
      .catch((error) => console.error("Erro ao deletar ferramenta:", error));
  };

  getModalTitle = () => {
    const { modalType, selectedTool } = this.state;
    if (modalType === "create") return "Cadastrar Ferramenta";
    if (modalType === "edit") return "Editar Ferramenta";
    if (modalType === "delete") return "Deletar Ferramenta";
    if (modalType === "history" && selectedTool) {
      return `Histórico de Empréstimos - ${selectedTool.name}`;
    }
    return "Modal";
  };

  render() {
    const { tools, showModal, modalType, formData, selectedTool, toolHistory, searchQuery } = this.state;

    return (
      <div>
        <h1 className="text-center mb-4">Gerenciar Ferramentas</h1>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nome ou ID"
            value={searchQuery}
            onChange={(e) => this.setState({ searchQuery: e.target.value })}
          />
          <Button variant="outline-secondary" onClick={this.fetchTools}>
            Buscar
          </Button>
        </InputGroup>

        <Button variant="primary" onClick={() => this.openModal("create")}>
          Cadastrar Nova Ferramenta
        </Button>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Disponível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id}>
                <td>{tool.id}</td>
                <td>{tool.name}</td>
                <td>{tool.description}</td>
                <td>{tool.available ? "Sim" : "Não"}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => this.openModal("edit", tool)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => this.openModal("delete", tool)}
                  >
                    Deletar
                  </Button>
                  <Button
                    variant="info"
                    className="ms-2"
                    onClick={() => this.openModal("history", tool)}
                  >
                    Ver Histórico
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal para criar/editar/deletar ferramenta */}
        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getModalTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === "history" && selectedTool ? (
              <div>
                <h5>Histórico de Empréstimos</h5>
                {toolHistory ? (
                  <div>
                    <p><strong>ID do Empréstimo:</strong> {toolHistory.id}</p>
                    <p><strong>Data de Empréstimo:</strong> {new Date(toolHistory.issueDate).toLocaleString()}</p>
                    <p><strong>Data de Devolução:</strong> {new Date(toolHistory.returnDate).toLocaleString()}</p>
                    <p><strong>Usuário:</strong> {toolHistory.user.name}</p>
                  </div>
                ) : (
                  <p>Carregando histórico...</p>
                )}
              </div>
            ) : (
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome da ferramenta"
                    name="name"
                    value={formData.name}
                    onChange={this.handleFormChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription" className="mt-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descrição da ferramenta"
                    name="description"
                    value={formData.description}
                    onChange={this.handleFormChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAvailable" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Disponível"
                    name="available"
                    checked={formData.available}
                    onChange={this.handleFormChange}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            {modalType === "history" ? (
              <Button variant="secondary" onClick={this.closeModal}>
                Fechar
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={this.closeModal}>
                  Cancelar
                </Button>
                <Button
                  variant={modalType === "delete" ? "danger" : "primary"}
                  onClick={modalType === "delete" ? this.handleDelete : this.handleSubmit}
                >
                  {modalType === "delete" ? "Deletar" : "Salvar"}
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ToolsManager;

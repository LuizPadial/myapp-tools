import React from "react";
import { Table, Button, InputGroup, FormControl } from "react-bootstrap";
import ToolModal from "./ToolModal"; // Importando o modal separado

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
      assignmentHistory: [],
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

  fetchAssignmentHistory = (toolId) => {
    console.log(`Buscando histórico para a ferramenta com ID: ${toolId}`);
    fetch(`http://localhost:8080/assignments/ferramentas/${toolId}/historico`) // URL corrigida
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar histórico de empréstimos");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dados do histórico:", data);
        // Aqui, assumimos que `data` é um array de empréstimos
        this.setState({ assignmentHistory: data });
      })
      .catch((error) => console.error("Erro ao carregar histórico:", error));
  };
  


  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value }, () => {
      this.fetchTools();
    });
  };

  openModal = (type, tool = null) => {
    this.setState({
      showModal: true,
      modalType: type,
      selectedTool: tool,
      formData: tool || { name: "", description: "", available: false },
    });

    if (type === "history" && tool) {
      this.fetchAssignmentHistory(tool.id); // Buscar histórico
    }
  };

  closeModal = () => {
    this.setState({ showModal: false, selectedTool: null, assignmentHistory: [] });
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

  render() {
    const { tools, showModal, modalType, formData, searchQuery, assignmentHistory, selectedTool } = this.state;

    return (
      <div>
        <h1 className="text-center mb-4">Gerenciar Ferramentas</h1>
        
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nome ou ID"
            value={searchQuery}
            onChange={this.handleSearchChange}
          />
          <Button variant="outline-secondary" onClick={() => this.fetchTools()}>
            Buscar
          </Button>
        </InputGroup>

        <Table striped bordered hover>
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
                    variant="info"
                    onClick={() => this.openModal("history", tool)}
                  >
                    Histórico
                  </Button>{" "}
                  <Button
                    variant="warning"
                    onClick={() => this.openModal("edit", tool)}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => this.openModal("delete", tool)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ToolModal
          show={showModal}
          modalType={modalType}
          formData={formData}
          assignmentHistory={assignmentHistory}
          onClose={this.closeModal}
          onSubmit={this.handleSubmit}
          onDelete={this.handleDelete}
          onFormChange={this.handleFormChange}
          selectedTool={selectedTool}
        />
      </div>
    );
  }
}

export default ToolsManager;

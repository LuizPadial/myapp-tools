import React from "react";
import { Table, Button, InputGroup, FormControl } from "react-bootstrap";
import ToolModal from "./ToolModal";

class ToolsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: [],
      searchQuery: "",
      showModal: false,
      modalType: "",
      selectedTool: null,
      formData: { name: "", description: "", available: false },
      assignmentHistory: [],
    };
  }

  componentDidMount() {
    this.fetchTools();
  }

  fetchTools = () => {
    const { searchQuery } = this.state;
    const url = searchQuery
      ? `http://localhost:8080/ferramentas/search?query=${searchQuery}`
      : "http://localhost:8080/ferramentas";
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => this.setState({ tools: Array.isArray(data) ? data : [] }))
      .catch((error) => console.error("Erro ao carregar ferramentas:", error));
  };

  fetchAssignmentHistory = (toolId) => {
    fetch(`http://localhost:8080/assignments/ferramentas/${toolId}/historico`)
      .then((response) => response.json())
      .then((data) => this.setState({ assignmentHistory: data }))
      .catch((error) => console.error("Erro ao carregar histórico:", error));
  };

  handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery }, this.fetchTools);
  };

  openModal = (type, tool = null) => {
    this.setState({
      showModal: true,
      modalType: type,
      selectedTool: tool,
      formData: tool || { name: "", description: "", available: false },
    });

    if (type === "history" && tool) {
      this.fetchAssignmentHistory(tool.id);
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
  handleUpdateTool = () => {
    const { formData, selectedTool } = this.state;
  
    // Envia uma requisição PUT para atualizar a ferramenta
    fetch(`http://localhost:8080/ferramentas/${selectedTool.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        available: formData.available,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar ferramenta.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Ferramenta atualizada:", data);
        this.fetchTools(); // Recarrega a lista de ferramentas
        this.closeModal(); // Fecha o modal
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao atualizar a ferramenta.");
      });
  };
  

  handleSubmit = () => {
    const { selectedTool, modalType } = this.state;
  
    // Verifica se o tipo do modal é 'edit' e chama a função de atualização
    if (modalType === "edit") {
      this.handleUpdateTool();  // Chama a função de atualização da ferramenta
    } else if (modalType === "history" && selectedTool && selectedTool.currentAssignment) {
      // URL para atualizar a data de devolução
      const returnDateUrl = `http://localhost:8080/assignments/${selectedTool.currentAssignment.id}/returnData`; 
      const returnDateMethod = "PUT";
  
      // A data de devolução (pode ser atual ou qualquer data desejada)
      const returnDate = new Date().toISOString();
      
      console.log("Enviando dados para a API:", { returnDate });
  
      // Requisição para atualizar a data de devolução
      fetch(returnDateUrl, {
        method: returnDateMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnDate }),  // Envia a data de devolução no corpo da requisição
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao atualizar a data de devolução");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Resposta do servidor (data de devolução):", data);
  
          // Requisição para atualizar a disponibilidade da ferramenta
          const toolId = selectedTool.id;
          const updatedAvailability = { available: true }; // Marca a ferramenta como disponível após devolução
          const availabilityUrl = `http://localhost:8080/ferramentas/status/${toolId}`;
  
          return fetch(availabilityUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAvailability),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao atualizar a disponibilidade da ferramenta");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Resposta do servidor (disponibilidade da ferramenta):", data);
          this.fetchTools();  // Atualiza a lista de ferramentas
          this.closeModal();  // Fecha o modal
        })
        .catch((error) => {
          console.error("Erro:", error);
          alert("Erro ao salvar ferramenta.");
        });
    }
  };
  
  
  

  handleToggleAvailability = (toolId, available) => {
    const updatedAvailability = { available: !available };
    const url = `http://localhost:8080/ferramentas/status/${toolId}`;
    
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAvailability),
    })
      .then((response) => {
        if (response.ok) {
          this.fetchTools();
        } else {
          alert("Erro ao atualizar disponibilidade.");
        }
      })
      .catch((error) => console.error("Erro ao atualizar disponibilidade:", error));
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

      handleReturnTool = (toolId) => {
        const url = `http://localhost:8080/assignments/${toolId}/returnData`;
        console.log(`Fazendo PUT para: ${url}`);  // Adicione esse log para verificar a URL
        fetch(url, {
          method: "PUT",
        })
          .then((response) => {
            if (response.ok) {
              this.fetchTools();  // Atualiza a lista de ferramentas
            } else {
              alert("Erro ao registrar devolução da ferramenta.");
            }
          })
          .catch((error) => console.error("Erro ao registrar devolução:", error));
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
          <Button variant="outline-secondary" onClick={this.fetchTools}>
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
                    variant={tool.available ? "warning" : "success"}
                    onClick={() => this.handleToggleAvailability(tool.id, tool.available)}
                  >
                    {tool.available ? "Marcar como indisponível" : "Marcar como disponível"}
                  </Button>{" "}
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

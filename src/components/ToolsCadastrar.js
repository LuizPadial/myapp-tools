import React, { Component } from "react";

class ToolCadastrar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      available: true,
      message: "", // Para exibir mensagens de sucesso/erro
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, available } = this.state;
    const toolData = { name, description, available };

    fetch("http://localhost:8080/ferramentas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toolData),
    })
      .then((response) => {
        if (response.ok) {
          this.setState({
            message: "Ferramenta cadastrada com sucesso!",
            name: "",
            description: "",
            available: true,
          });
        } else {
          this.setState({
            message: "Erro ao cadastrar ferramenta.",
          });
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        this.setState({
          message: "Erro ao cadastrar ferramenta.",
        });
      });
  };

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  render() {
    const { name, description, available, message } = this.state;
    return (
      <div className="form-container">
        <h2>Cadastrar Nova Ferramenta</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={name}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
              value={description}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="available"
                checked={available}
                onChange={this.handleChange}
              />
              Disponível
            </label>
          </div>
          {message && <div className="alert alert-info">{message}</div>}
          <button type="submit" className="btn btn-primary">
            Cadastrar
          </button>
        </form>
      </div>
    );
  }
}

export default ToolCadastrar;

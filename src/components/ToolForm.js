import React from "react";

class ToolForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            available: true,  // Por padrão, a ferramenta estará disponível
        };
    }

    // Função que será chamada quando o formulário for submetido
    handleSubmit = (event) => {
        event.preventDefault();
        const { name, description, available } = this.state;
        const formData = { name, description, available };
        this.props.onSubmit(formData); // Passa os dados do formulário para o componente pai
    };

    // Função que atualiza o estado conforme o usuário digita no campo
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>Nome da Ferramenta:</label>
                    <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Descrição:</label>
                    <input
                        type="text"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Disponível:</label>
                    <input
                        type="checkbox"
                        name="available"
                        checked={this.state.available}
                        onChange={(e) => this.setState({ available: e.target.checked })}
                    />
                </div>
                <button type="submit">Cadastrar Ferramenta</button>
            </form>
        );
    }
}

export default ToolForm;

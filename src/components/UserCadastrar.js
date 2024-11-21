import React from "react";
import UserForm from "./UserForm"; // Importando o componente UserForm

class UserCadastrar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                name: '',
                registration: '',
                biometricData: '',
                manager: false,
                username: '',
                password: ''
            }
        };
    }

    // Função que será chamada no submit do formulário
    handleFormSubmit = (formData) => {
        // Aqui você pode implementar o envio dos dados para o backend (POST)
        fetch("http://localhost:8080/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                // Aqui você pode fazer algo após o envio, como limpar o formulário ou redirecionar
                alert("Usuário cadastrado com sucesso!");
            } else {
                alert("Erro ao cadastrar usuário.");
            }
        })
        .catch(error => console.error("Erro ao cadastrar:", error));
    };

    render() {
        return (
            <div>
                <h2 className="text-center mb-4">Cadastrar Novo Usuário</h2>
                {/* Passando a função de submit para o UserForm */}
                <UserForm onSubmit={this.handleFormSubmit} />
            </div>
        );
    }
}

export default UserCadastrar;

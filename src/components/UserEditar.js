import React from 'react';
import { Button, Modal } from 'react-bootstrap'; // Importando o modal e o botão do Bootstrap

class UserEditar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            currentUser: null, // Armazena o usuário que será editado
        };

        // Vinculando os métodos ao this
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    // Função para abrir o modal
    openModal(user) {
        this.setState({ showModal: true, currentUser: user });
    }

    // Função para fechar o modal
    closeModal() {
        this.setState({ showModal: false, currentUser: null });
    }

    render() {
        return (
            <div>
                {/* Botão de edição que chama a função openModal */}
                <Button variant="warning" onClick={() => this.openModal(this.props.user)}>
                    Editar
                </Button>

                {/* Modal */}
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Usuário</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Aqui você pode colocar um formulário ou outros campos para editar o usuário */}
                        <p>Nome: {this.state.currentUser?.name}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Fechar
                        </Button>
                        <Button variant="primary">Salvar alterações</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default UserEditar;

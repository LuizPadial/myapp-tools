import React, { Component } from 'react';
import { Table, Button, Spinner, Form } from 'react-bootstrap';

class HistoricoUsuarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historicoAssignments: [],
      loading: false,
      userId: '',
      errorMessage: '',
    };
  }

  // Função para buscar o histórico com base no ID
  fetchHistorico = () => {
    const { userId } = this.state;

    if (!userId) {
      this.setState({ errorMessage: 'Por favor, insira um ID de usuário.' });
      return;
    }

    this.setState({ loading: true, errorMessage: '' });

    fetch(`http://localhost:8080/assignments/usuario/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Verificando a estrutura dos dados recebidos

        if (data.length === 0) {
          this.setState({ historicoAssignments: [], loading: false, errorMessage: 'Nenhum histórico encontrado.' });
        } else {
          this.setState({ historicoAssignments: data, loading: false });
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar histórico:', error);
        this.setState({ loading: false, errorMessage: 'Erro ao buscar histórico.' });
      });
  };

  handleInputChange = (event) => {
    this.setState({ userId: event.target.value });
  };

  render() {
    const { historicoAssignments, loading, userId, errorMessage } = this.state;

    return (
      <div>
        <h2>Histórico de Ferramentas</h2>

        {/* Campo para digitar o ID do usuário */}
        <Form.Group controlId="formUserId">
          <Form.Label>Digite o ID do usuário</Form.Label>
          <Form.Control
            type="number"
            placeholder="Insira o ID"
            value={userId}
            onChange={this.handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={this.fetchHistorico}>
          Buscar Histórico
        </Button>

        {/* Exibir mensagens de erro */}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        {/* Exibir o histórico ou mensagem de carregamento */}
        {loading ? (
          <Spinner animation="border" />
        ) : historicoAssignments.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Ferramenta</th>
                <th>Data de Retirada</th>
                <th>Data de Devolução</th>
              </tr>
            </thead>
            <tbody>
              {historicoAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.id}</td>
                  <td>{assignment.tools?.name || 'Não disponível'}</td> {/* Ajustando para acessar o nome da ferramenta */}
                  <td>{assignment.issueDate || 'Não disponível'}</td> {/* Ajustando para acessar a data de atribuição */}
                  <td>{assignment.returnDate || 'Aguardando devolução'}</td> {/* Ajustando para acessar a data de devolução */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Não há histórico de ferramentas para este usuário.</p>
        )}

        <Button href="/usuarios">Voltar</Button>
      </div>
    );
  }
}

export default HistoricoUsuarios;

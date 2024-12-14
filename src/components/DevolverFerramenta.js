import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const DevolverFerramenta = () => {
  const [assignmentId, setAssignmentId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState(null); // Para exibir mensagens de sucesso ou erro
  const [error, setError] = useState(null); // Para exibir mensagens de erro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:8080/assignments/${assignmentId}/returnData`,
        { returnDate }
      );

      setMessage("Ferramenta devolvida com sucesso!");
    } catch (err) {
      setError("Erro ao devolver ferramenta. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Devolver Ferramenta</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="assignmentId">
          <Form.Label>ID do Empréstimo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o ID do empréstimo"
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="returnDate" className="mt-3">
          <Form.Label>Data de Devolução</Form.Label>
          <Form.Control
            type="datetime-local"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-3" variant="primary" type="submit">
          Devolver Ferramenta
        </Button>
      </Form>
      {message && <Alert className="mt-3" variant="success">{message}</Alert>}
      {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
    </div>
  );
};

export default DevolverFerramenta;

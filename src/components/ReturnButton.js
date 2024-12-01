// Verifique se o componente está sendo exportado corretamente
import React from 'react';
import { Button } from 'react-bootstrap';

const ReturnButton = ({ assignmentId, onReturnSuccess }) => {
  const handleReturn = () => {
    // Implementação de devolução da ferramenta
    fetch(`http://localhost:8080/assignments/return/${assignmentId}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          onReturnSuccess(data.assignment); // Executa o callback com sucesso
        } else {
          alert('Erro ao devolver a ferramenta.');
        }
      })
      .catch((error) => console.error('Erro ao devolver a ferramenta:', error));
  };

  return (
    <Button variant="success" onClick={handleReturn}>
      Devolver Ferramenta
    </Button>
  );
};

export default ReturnButton;

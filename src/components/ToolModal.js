import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ToolModal = ({
  show,
  modalType,
  formData,
  assignmentHistory,
  onClose,
  onSubmit,
  onDelete,
  onFormChange,
  selectedTool
}) => {
  const getModalTitle = () => {
    if (modalType === "create") return "Cadastrar Ferramenta";
    if (modalType === "edit") return "Editar Ferramenta";
    if (modalType === "delete") return "Deletar Ferramenta";
    if (modalType === "history" && selectedTool) {
      return `Histórico de Empréstimos - ${selectedTool.name}`;
    }
    return "Modal";
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === "history" ? (
            <div>
            <h5>Histórico de Empréstimos</h5>
            {assignmentHistory && assignmentHistory.length > 0 ? (
                <ul>
                {assignmentHistory.map((assignment, index) => (
                    <li key={index}>
                    <strong>ID do Empréstimo:</strong> {assignment.id} <br />
                    <strong>Usuário:</strong> {assignment.user.name} <br />
                    <strong>Ferramenta:</strong> {assignment.tools.name} <br />
                    <strong>Data de Empréstimo:</strong> {new Date(assignment.issueDate).toLocaleString()} <br />
                    <strong>Data de Devolução:</strong> 
                    {assignment.returnDate 
                        ? new Date(assignment.returnDate).toLocaleString() 
                        : "Aguardando devolução"} <br />
                    </li>
                ))}
                </ul>
            ) : (
                <p>Nenhum histórico encontrado para esta ferramenta.</p>
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
                onChange={onFormChange}
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
                onChange={onFormChange}
                />
            </Form.Group>
            <Form.Group controlId="formAvailable" className="mt-3">
                <Form.Check
                type="checkbox"
                label="Disponível"
                name="available"
                checked={formData.available}
                onChange={onFormChange}
                />
            </Form.Group>
            </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {modalType === "delete" ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Deletar
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Salvar
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ToolModal;

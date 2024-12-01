import React, { useState, useEffect } from "react";

const RetirarFerramenta = () => {
  const [users, setUsers] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Buscar usuários e ferramentas
  useEffect(() => {
    // Buscar usuários
    fetch("http://localhost:8080/users") // Substitua pela URL correta do seu backend
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar usuários");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Usuários:", data); // Debug
        setUsers(data);
      })
      .catch((error) => console.error("Erro ao carregar usuários:", error));

    // Buscar ferramentas
    fetch("http://localhost:8080/ferramentas") // Substitua pela URL correta do seu backend
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar ferramentas");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Ferramentas:", data); // Debug
        setTools(data);
      })
      .catch((error) => console.error("Erro ao carregar ferramentas:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAssignment = {
      user: { id: selectedUser },
      tools: { id: selectedTool },
      issueDate: issueDate,
      returnDate: returnDate,
    };

    // Enviar dados do empréstimo
    fetch("http://localhost:8080/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAssignment),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao realizar empréstimo.");
        }
        alert("Empréstimo realizado com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao realizar empréstimo.");
        console.error("Erro ao realizar empréstimo:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h1>Retirar Ferramenta</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user" className="form-label">
            Usuário:
          </label>
          <select
            id="user"
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Selecione um usuário</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option>Carregando...</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="tool" className="form-label">
            Ferramenta:
          </label>
          <select
            id="tool"
            className="form-select"
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            required
          >
            <option value="">Selecione uma ferramenta</option>
            {tools.length > 0 ? (
              tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))
            ) : (
              <option>Carregando...</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="issueDate" className="form-label">
            Data de Empréstimo:
          </label>
          <input
            type="datetime-local"
            id="issueDate"
            className="form-control"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="returnDate" className="form-label">
            Data de Devolução:
          </label>
          <input
            type="datetime-local"
            id="returnDate"
            className="form-control"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Registrar Empréstimo
        </button>
      </form>
    </div>
  );
};

export default RetirarFerramenta;

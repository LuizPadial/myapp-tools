// Função para buscar todos os usuários
export const fetchUsers = async () => {
    try {
      const response = await fetch("/users");  // Endpoint que retorna os usuários
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Erro ao buscar usuários");
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Função para buscar todas as ferramentas
  export const fetchTools = async () => {
    try {
      const response = await fetch("/ferramentas");  // Endpoint que retorna as ferramentas
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Erro ao buscar ferramentas");
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Função para buscar ferramentas do usuário
  export const fetchUserTools = async (userId) => {
    try {
      const response = await fetch(`/assignments/user/${userId}`);  // Endpoint que retorna as ferramentas de um usuário
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Erro ao buscar ferramentas do usuário");
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Função para realizar o empréstimo de ferramenta
  export const assignToolToUser = async (userId, toolId) => {
    try {
      const response = await fetch("/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { id: userId },
          tool: { id: toolId },
        }),
      });
  
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Erro ao realizar empréstimo");
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  
  
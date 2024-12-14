import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Para customizações de estilo

import Tools from './components/ToolsManager';
import Users from './components/Users';
import UserCadastrar from './components/UserCadastrar';
import UserEditar from './components/UserEditar';
import RetirarFerramenta from './components/RetirarFerramenta';
import ToolsCadastrar from './components/ToolsCadastrar'; // Importando o componente de cadastrar ferramenta
import DevolverFerramenta from './components/DevolverFerramenta';
import HistoricoUsuarios from './components/HistoricoUsuarios'; // Importando o componente de Histórico
import logo from './assets/logo.png'; // Importando a logo

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="dashboard-container">
          {/* Sidebar */}
          <nav className="sidebar">
          <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" /> {/* Exibindo a logo */}
              <h2>Tools Manager</h2>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios">Usuários</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cadastrarUsuario">Cadastrar Usuário</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/historico">Histórico Usuários</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ferramentas">Ferramentas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cadastrarFerramenta">Cadastrar Ferramenta</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/assignments">Retirar Ferramenta</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/devolver-ferramenta">Devolver Ferramenta</Link>
              </li>
              {/* Link do Histórico de Ferramentas */}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="main-content">
            <Routes>
              <Route path="/usuarios" element={<Users />} />
              <Route path="/ferramentas" element={<Tools />} />
              <Route path="/cadastrarUsuario" element={<UserCadastrar />} />
              <Route path="/editarUsuario/:id" element={<UserEditar />} />
              <Route path="/assignments" element={<RetirarFerramenta />} />
              <Route path="/cadastrarFerramenta" element={<ToolsCadastrar />} />
              <Route path="/devolver-ferramenta" element={<DevolverFerramenta />} />
              {/* Rota para Histórico de Ferramentas */}
              <Route path="/historico" element={<HistoricoUsuarios />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

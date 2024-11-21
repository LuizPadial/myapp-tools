import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Para customizações de estilo

import Tools from './components/Tools';
import Users from './components/Users';
import UserCadastrar from './components/UserCadastrar';
import UserEditar from './components/UserEditar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="dashboard-container">
          {/* Sidebar */}
          <nav className="sidebar">
            <h2>Tools Manager</h2>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios">Usuários</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cadastrarUsuario">Cadastrar Usuário</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ferramentas">Ferramentas</Link>
              </li>

            </ul>
          </nav>

          {/* Main Content */}
          <div className="main-content">
            <Routes>
              <Route path="/usuarios" element={<Users />} />
              <Route path="/ferramentas" element={<Tools />} />
              <Route path="/cadastrarUsuario" element={<UserCadastrar />} />
              <Route path="/editarUsuario/:id" element={<UserEditar />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

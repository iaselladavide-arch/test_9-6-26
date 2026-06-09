import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Gestione Rimborsi
        </Link>

        <div className="navbar-content">
          {user ? (
            <>
              <div className="navbar-user">
                <span>{user.nome} {user.cognome}</span>
                <small>{user.ruolo}</small>
              </div>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Registrati</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

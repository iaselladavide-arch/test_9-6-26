import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

export function Home() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="dashboard-redirect">
        <h1>Benvenuto!</h1>
        <p>Clicca il link sottostante per accedere al tuo dashboard.</p>
        <Link to="/dashboard" className="dashboard-link">Vai al Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Gestione Rimborsi Spese Aziendali</h1>
        <p className="hero-subtitle">Sistema completo per la gestione delle richieste di rimborso</p>

        <div className="hero-buttons">
          <Link to="/login" className="btn-primary">Accedi</Link>
          <Link to="/register" className="btn-secondary">Registrati</Link>
        </div>
      </div>

      <div className="features">
        <div className="feature">
          <h3>Per Dipendenti</h3>
          <ul>
            <li>Inserisci richieste di rimborso</li>
            <li>Visualizza lo stato delle tue richieste</li>
            <li>Modifica richieste in sospeso</li>
            <li>Filtra per categoria e periodo</li>
          </ul>
        </div>

        <div className="feature">
          <h3>Per Responsabili</h3>
          <ul>
            <li>Approva o rifiuta richieste</li>
            <li>Registra liquidazioni</li>
            <li>Visualizza statistiche</li>
            <li>Analizza dati aggregati</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Auth.css';

export function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    confirmPassword: '',
    ruolo: 'Dipendente'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/utenti/register', formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registrazione</h1>
        <p className="auth-subtitle">Crea un nuovo account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Il tuo nome"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cognome">Cognome *</label>
            <input
              id="cognome"
              name="cognome"
              type="text"
              value={formData.cognome}
              onChange={handleChange}
              required
              placeholder="Il tuo cognome"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="esempio@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Almeno 6 caratteri"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Conferma Password *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Ripeti la password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ruolo">Ruolo *</label>
            <select
              id="ruolo"
              name="ruolo"
              value={formData.ruolo}
              onChange={handleChange}
              required
            >
              <option value="Dipendente">Dipendente</option>
              <option value="Responsabile amministrativo">Responsabile amministrativo</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>

        <p className="auth-footer">
          Hai già un account? <Link to="/login">Accedi qui</Link>
        </p>
      </div>
    </div>
  );
}

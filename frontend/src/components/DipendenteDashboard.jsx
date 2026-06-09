import { useState, useEffect } from 'react';
import api from '../services/api';
import { ListaRimborsi } from './ListaRimborsi';
import { FormRichiesta } from './FormRichiesta';
import '../styles/DashboardContent.css';

export function DipendenteDashboard() {
  const [richieste, setRichieste] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    stato: '',
    categoria: '',
    mese: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCategorie();
    loadRichieste();
  }, []);

  useEffect(() => {
    loadRichieste();
  }, [filters]);

  const loadCategorie = async () => {
    try {
      const response = await api.get('/categorie-spesa');
      setCategorie(response.data);
    } catch (err) {
      console.error('Errore nel caricamento categorie:', err);
    }
  };

  const loadRichieste = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.stato) params.append('stato', filters.stato);
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.mese) params.append('mese', filters.mese);

      const response = await api.get(`/rimborsi?${params.toString()}`);
      setRichieste(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRichiestaCreated = () => {
    setShowForm(false);
    loadRichieste();
  };

  const handleRichiestaUpdated = () => {
    loadRichieste();
  };

  const handleRichiestaDeleted = () => {
    loadRichieste();
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-actions">
        <button
          className={`btn-primary ${showForm ? 'active' : ''}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Chiudi' : 'Nuova Richiesta'}
        </button>
      </div>

      {showForm && (
        <FormRichiesta
          categorie={categorie}
          onSuccess={handleRichiestaCreated}
        />
      )}

      <div className="filters">
        <h3>Filtri</h3>
        <div className="filter-group">
          <label>Stato</label>
          <select name="stato" value={filters.stato} onChange={handleFilterChange}>
            <option value="">Tutti gli stati</option>
            <option value="In attesa">In attesa</option>
            <option value="Approvata">Approvata</option>
            <option value="Rifiutata">Rifiutata</option>
            <option value="Liquidata">Liquidata</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Categoria</label>
          <select name="categoria" value={filters.categoria} onChange={handleFilterChange}>
            <option value="">Tutte le categorie</option>
            {categorie.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.descrizione}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Mese</label>
          <input
            type="month"
            name="mese"
            value={filters.mese}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Caricamento...</div>
      ) : (
        <ListaRimborsi
          richieste={richieste}
          isDipendente={true}
          onUpdated={handleRichiestaUpdated}
          onDeleted={handleRichiestaDeleted}
        />
      )}
    </div>
  );
}

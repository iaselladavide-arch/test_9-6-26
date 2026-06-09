import { useState, useEffect } from 'react';
import api from '../services/api';
import { ListaRimborsi } from './ListaRimborsi';
import { Statistiche } from './Statistiche';
import '../styles/DashboardContent.css';

export function ResponsabileDashboard() {
  const [richieste, setRichieste] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('richieste');
  const [filters, setFilters] = useState({
    stato: '',
    categoria: '',
    mese: '',
    dipendente: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'richieste') {
      loadRichieste();
    }
  }, [filters, activeTab]);

  const loadData = async () => {
    try {
      const [categorieRes, utentiRes] = await Promise.all([
        api.get('/categorie-spesa'),
        api.get('/rimborsi')
      ]);

      setCategorie(categorieRes.data);

      const utentiMap = {};
      utentiRes.data.forEach(richiesta => {
        if (richiesta.dipendenteId && !utentiMap[richiesta.dipendenteId._id]) {
          utentiMap[richiesta.dipendenteId._id] = richiesta.dipendenteId;
        }
      });
      setUtenti(Object.values(utentiMap));
    } catch (err) {
      console.error('Errore nel caricamento dati:', err);
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
      if (filters.dipendente) params.append('dipendente', filters.dipendente);

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

  const handleRichiestaUpdated = () => {
    loadRichieste();
    loadData();
  };

  return (
    <div className="dashboard-content">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'richieste' ? 'active' : ''}`}
          onClick={() => setActiveTab('richieste')}
        >
          Richieste
        </button>
        <button
          className={`tab-btn ${activeTab === 'statistiche' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistiche')}
        >
          Statistiche
        </button>
      </div>

      {activeTab === 'richieste' && (
        <>
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
              <label>Dipendente</label>
              <select name="dipendente" value={filters.dipendente} onChange={handleFilterChange}>
                <option value="">Tutti i dipendenti</option>
                {utenti.map(utente => (
                  <option key={utente._id} value={utente._id}>
                    {utente.nome} {utente.cognome}
                  </option>
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
              isDipendente={false}
              onUpdated={handleRichiestaUpdated}
            />
          )}
        </>
      )}

      {activeTab === 'statistiche' && (
        <Statistiche categorie={categorie} utenti={utenti} />
      )}
    </div>
  );
}

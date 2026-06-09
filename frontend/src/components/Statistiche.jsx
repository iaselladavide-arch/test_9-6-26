import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Statistiche.css';

export function Statistiche({ categorie, utenti }) {
  const [statistiche, setStatistiche] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    mese: '',
    categoriaId: '',
    dipendenteId: ''
  });

  useEffect(() => {
    loadStatistiche();
  }, [filters]);

  const loadStatistiche = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.mese) params.append('mese', filters.mese);
      if (filters.categoriaId) params.append('categoriaId', filters.categoriaId);
      if (filters.dipendenteId) params.append('dipendenteId', filters.dipendenteId);

      const response = await api.get(`/statistiche/rimborsi?${params.toString()}`);
      setStatistiche(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nel caricamento delle statistiche');
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

  const totali = statistiche.reduce((acc, stat) => ({
    numeroRichieste: acc.numeroRichieste + stat.numeroRichieste,
    totaleRichiesto: acc.totaleRichiesto + stat.totaleRichiesto,
    totaleApprovato: acc.totaleApprovato + stat.totaleApprovato,
    totaleLiquidato: acc.totaleLiquidato + stat.totaleLiquidato
  }), { numeroRichieste: 0, totaleRichiesto: 0, totaleApprovato: 0, totaleLiquidato: 0 });

  return (
    <div className="statistiche-container">
      <div className="filters">
        <h3>Filtri</h3>
        <div className="filter-group">
          <label>Mese</label>
          <input
            type="month"
            name="mese"
            value={filters.mese}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Categoria</label>
          <select name="categoriaId" value={filters.categoriaId} onChange={handleFilterChange}>
            <option value="">Tutte le categorie</option>
            {categorie.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.descrizione}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Dipendente</label>
          <select name="dipendenteId" value={filters.dipendenteId} onChange={handleFilterChange}>
            <option value="">Tutti i dipendenti</option>
            {utenti.map(utente => (
              <option key={utente._id} value={utente._id}>
                {utente.nome} {utente.cognome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Caricamento...</div>
      ) : (
        <>
          {statistiche.length > 0 ? (
            <>
              <div className="totali-summary">
                <div className="summary-card">
                  <h4>Richieste Totali</h4>
                  <p className="summary-value">{totali.numeroRichieste}</p>
                </div>
                <div className="summary-card">
                  <h4>Totale Richiesto</h4>
                  <p className="summary-value">€ {totali.totaleRichiesto.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                  <h4>Totale Approvato</h4>
                  <p className="summary-value">€ {totali.totaleApprovato.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                  <h4>Totale Liquidato</h4>
                  <p className="summary-value">€ {totali.totaleLiquidato.toFixed(2)}</p>
                </div>
              </div>

              <table className="statistiche-table">
                <thead>
                  <tr>
                    <th>Mese</th>
                    <th>Categoria</th>
                    <th>N. Richieste</th>
                    <th>Totale Richiesto</th>
                    <th>Totale Approvato</th>
                    <th>Totale Liquidato</th>
                  </tr>
                </thead>
                <tbody>
                  {statistiche.map((stat, idx) => (
                    <tr key={idx}>
                      <td>{stat.mese}</td>
                      <td>{stat.categoria}</td>
                      <td>{stat.numeroRichieste}</td>
                      <td>€ {stat.totaleRichiesto.toFixed(2)}</td>
                      <td>€ {stat.totaleApprovato.toFixed(2)}</td>
                      <td>€ {stat.totaleLiquidato.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="empty-state">Nessun dato disponibile per i filtri selezionati</div>
          )}
        </>
      )}
    </div>
  );
}

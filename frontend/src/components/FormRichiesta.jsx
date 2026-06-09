import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Form.css';

export function FormRichiesta({ richiestaId, categorie, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    dataSpesa: '',
    categoriaId: '',
    importo: '',
    descrizione: '',
    riferimentoGiustificativo: ''
  });
  const [categories, setCategories] = useState(categorie || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!categories.length && !categorie) {
      loadCategorie();
    }
    if (richiestaId) {
      loadRichiesta();
    }
  }, [richiestaId]);

  const loadCategorie = async () => {
    try {
      const response = await api.get('/categorie-spesa');
      setCategories(response.data);
    } catch (err) {
      setError('Errore nel caricamento delle categorie');
    }
  };

  const loadRichiesta = async () => {
    try {
      const response = await api.get(`/rimborsi/${richiestaId}`);
      const richiesta = response.data;
      setFormData({
        dataSpesa: richiesta.dataSpesa.split('T')[0],
        categoriaId: richiesta.categoriaId._id,
        importo: richiesta.importo,
        descrizione: richiesta.descrizione,
        riferimentoGiustificativo: richiesta.riferimentoGiustificativo || ''
      });
    } catch (err) {
      setError('Errore nel caricamento della richiesta');
    }
  };

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
      if (richiestaId) {
        await api.put(`/rimborsi/${richiestaId}`, formData);
      } else {
        await api.post('/rimborsi', formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-richiesta" onSubmit={handleSubmit}>
      <h3>{richiestaId ? 'Modifica Richiesta' : 'Nuova Richiesta'}</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="dataSpesa">Data Spesa *</label>
        <input
          id="dataSpesa"
          name="dataSpesa"
          type="date"
          value={formData.dataSpesa}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoriaId">Categoria *</label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
          required
        >
          <option value="">Seleziona una categoria</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.descrizione}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="importo">Importo (€) *</label>
        <input
          id="importo"
          name="importo"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.importo}
          onChange={handleChange}
          required
          placeholder="Es: 50.00"
        />
      </div>

      <div className="form-group">
        <label htmlFor="descrizione">Descrizione *</label>
        <textarea
          id="descrizione"
          name="descrizione"
          value={formData.descrizione}
          onChange={handleChange}
          required
          placeholder="Descrivi la spesa..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="riferimentoGiustificativo">Riferimento Giustificativo</label>
        <input
          id="riferimentoGiustificativo"
          name="riferimentoGiustificativo"
          type="text"
          value={formData.riferimentoGiustificativo}
          onChange={handleChange}
          placeholder="Es: Ricevuta #12345"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvataggio...' : richiestaId ? 'Aggiorna' : 'Crea'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annulla
          </button>
        )}
      </div>
    </form>
  );
}

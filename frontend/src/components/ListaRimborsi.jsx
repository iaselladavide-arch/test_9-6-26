import { useState } from 'react';
import api from '../services/api';
import { DettaglioRichiesta } from './DettaglioRichiesta';
import { FormRichiesta } from './FormRichiesta';
import '../styles/Lista.css';

export function ListaRimborsi({ richieste, isDipendente, onUpdated, onDeleted }) {
  const [selectedRichiesta, setSelectedRichiesta] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [categorie, setCategorie] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const handleViewDetails = async (richiesta) => {
    try {
      const response = await api.get(`/rimborsi/${richiesta._id}`);
      setSelectedRichiesta(response.data);
    } catch (err) {
      setError('Errore nel caricamento dei dettagli');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa richiesta?')) return;

    setActionLoading(id);
    try {
      await api.delete(`/rimborsi/${id}`);
      onDeleted?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nell\'eliminazione');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprova = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/rimborsi/${id}/approva`);
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nell\'approvazione');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRifiuta = async (id) => {
    const motivazione = prompt('Indicare la motivazione del rifiuto (opzionale):');
    if (motivazione === null) return;

    setActionLoading(id);
    try {
      await api.put(`/rimborsi/${id}/rifiuta`, { motivazione });
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nel rifiuto');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLiquidata = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/rimborsi/${id}/liquida`);
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nella liquidazione');
    } finally {
      setActionLoading(null);
    }
  };

  if (selectedRichiesta) {
    return (
      <DettaglioRichiesta
        richiesta={selectedRichiesta}
        isDipendente={isDipendente}
        onBack={() => setSelectedRichiesta(null)}
        onUpdated={onUpdated}
      />
    );
  }

  if (editingId) {
    return (
      <FormRichiesta
        richiestaId={editingId}
        onSuccess={() => {
          setEditingId(null);
          onUpdated?.();
        }}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  if (richieste.length === 0) {
    return <div className="empty-state">Nessuna richiesta trovata</div>;
  }

  return (
    <div className="lista-rimborsi">
      {error && <div className="error-message">{error}</div>}

      <table className="rimborsi-table">
        <thead>
          <tr>
            <th>Data Spesa</th>
            <th>Categoria</th>
            <th>Importo</th>
            <th>Descrizione</th>
            <th>Stato</th>
            {!isDipendente && <th>Dipendente</th>}
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {richieste.map(richiesta => (
            <tr key={richiesta._id} className={`stato-${richiesta.stato.toLowerCase()}`}>
              <td>{new Date(richiesta.dataSpesa).toLocaleDateString('it-IT')}</td>
              <td>{richiesta.categoriaId?.descrizione}</td>
              <td>€ {parseFloat(richiesta.importo).toFixed(2)}</td>
              <td>{richiesta.descrizione}</td>
              <td>
                <span className={`badge badge-${richiesta.stato.toLowerCase()}`}>
                  {richiesta.stato}
                </span>
              </td>
              {!isDipendente && (
                <td>{richiesta.dipendenteId?.nome} {richiesta.dipendenteId?.cognome}</td>
              )}
              <td className="actions">
                <button
                  className="btn-small btn-view"
                  onClick={() => handleViewDetails(richiesta)}
                >
                  Dettagli
                </button>

                {isDipendente && richiesta.stato === 'In attesa' && (
                  <>
                    <button
                      className="btn-small btn-edit"
                      onClick={() => setEditingId(richiesta._id)}
                    >
                      Modifica
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(richiesta._id)}
                      disabled={actionLoading === richiesta._id}
                    >
                      Elimina
                    </button>
                  </>
                )}

                {!isDipendente && richiesta.stato === 'In attesa' && (
                  <>
                    <button
                      className="btn-small btn-success"
                      onClick={() => handleApprova(richiesta._id)}
                      disabled={actionLoading === richiesta._id}
                    >
                      Approva
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleRifiuta(richiesta._id)}
                      disabled={actionLoading === richiesta._id}
                    >
                      Rifiuta
                    </button>
                  </>
                )}

                {!isDipendente && richiesta.stato === 'Approvata' && (
                  <button
                    className="btn-small btn-success"
                    onClick={() => handleLiquidata(richiesta._id)}
                    disabled={actionLoading === richiesta._id}
                  >
                    Liquida
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

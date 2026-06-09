import '../styles/Dettaglio.css';

export function DettaglioRichiesta({ richiesta, isDipendente, onBack, onUpdated }) {
  return (
    <div className="dettaglio-container">
      <button className="btn-back" onClick={onBack}>← Torna alla lista</button>

      <div className="dettaglio-card">
        <h2>Dettagli Richiesta</h2>

        <div className="dettaglio-grid">
          <div className="dettaglio-item">
            <label>ID Richiesta:</label>
            <p>{richiesta._id}</p>
          </div>

          <div className="dettaglio-item">
            <label>Data Spesa:</label>
            <p>{new Date(richiesta.dataSpesa).toLocaleDateString('it-IT')}</p>
          </div>

          <div className="dettaglio-item">
            <label>Categoria:</label>
            <p>{richiesta.categoriaId?.descrizione}</p>
          </div>

          <div className="dettaglio-item">
            <label>Importo:</label>
            <p>€ {parseFloat(richiesta.importo).toFixed(2)}</p>
          </div>

          <div className="dettaglio-item">
            <label>Descrizione:</label>
            <p>{richiesta.descrizione}</p>
          </div>

          {richiesta.riferimentoGiustificativo && (
            <div className="dettaglio-item">
              <label>Riferimento Giustificativo:</label>
              <p>{richiesta.riferimentoGiustificativo}</p>
            </div>
          )}

          <div className="dettaglio-item">
            <label>Stato:</label>
            <span className={`badge badge-${richiesta.stato.toLowerCase()}`}>
              {richiesta.stato}
            </span>
          </div>

          {!isDipendente && (
            <div className="dettaglio-item">
              <label>Dipendente:</label>
              <p>{richiesta.dipendenteId?.nome} {richiesta.dipendenteId?.cognome}</p>
            </div>
          )}

          <div className="dettaglio-item">
            <label>Data Inserimento:</label>
            <p>{new Date(richiesta.dataInserimento).toLocaleDateString('it-IT')}</p>
          </div>

          {richiesta.dataValutazione && (
            <div className="dettaglio-item">
              <label>Data Valutazione:</label>
              <p>{new Date(richiesta.dataValutazione).toLocaleDateString('it-IT')}</p>
            </div>
          )}

          {richiesta.responsabileValutazioneId && (
            <div className="dettaglio-item">
              <label>Responsabile Valutazione:</label>
              <p>{richiesta.responsabileValutazioneId?.nome} {richiesta.responsabileValutazioneId?.cognome}</p>
            </div>
          )}

          {richiesta.motivazioneRifiuto && (
            <div className="dettaglio-item">
              <label>Motivazione Rifiuto:</label>
              <p>{richiesta.motivazioneRifiuto}</p>
            </div>
          )}

          {richiesta.dataLiquidazione && (
            <div className="dettaglio-item">
              <label>Data Liquidazione:</label>
              <p>{new Date(richiesta.dataLiquidazione).toLocaleDateString('it-IT')}</p>
            </div>
          )}
        </div>

        <button className="btn-back" onClick={onBack}>← Torna alla lista</button>
      </div>
    </div>
  );
}

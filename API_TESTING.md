# Testing API con Postman

## Setup Postman

### 1. Import della Collezione

1. Apri Postman
2. Clicca **"Import"** (angolo in alto a sinistra)
3. Seleziona il file `Postman_Collection.json`
4. La collezione "Gestione Rimborsi Spese Aziendali" apparirà nella sidebar

### 2. Configurazione Environment

La collezione ha variabili pre-configurate:

| Variabile | Valore |
|-----------|--------|
| `baseUrl` | `https://test-9-6-26.onrender.com/api` |
| `token` | (vuoto - impostato dopo login) |
| `richiestaId` | ID della richiesta (da copiare da risposte) |
| `categoriaId` | ID categoria (da copiare da risposte) |

## Flusso di Test Consigliato

### Step 1: Login (Dipendente)

**Request**: `Autenticazione` → `Login`

**Body**:
```json
{
  "email": "mario.rossi@company.com",
  "password": "password123"
}
```

**Risultato**: 
- Copia il `token` dalla risposta
- Postman lo salva automaticamente in `pm.environment.set("token", ...)`

---

### Step 2: Ottieni le Categorie

**Request**: `Categorie` → `Elenco Categorie`

**Risultato**:
- Lista di categorie disponibili
- Copia l'ID di una categoria (es: "Trasferta")

---

### Step 3: Crea una Richiesta di Rimborso

**Request**: `Rimborsi` → `Crea Richiesta`

**Body** (modifica `categoriaId` con quella copiata):
```json
{
  "dataSpesa": "2026-06-05",
  "categoriaId": "INCOLLA_ID_QUI",
  "importo": 150.50,
  "descrizione": "Trasferta a Milano",
  "riferimentoGiustificativo": "Scontrino #12345"
}
```

**Risultato**:
- ID della richiesta creata
- Copia l'ID dalla risposta (campo `richiesta._id`)

---

### Step 4: Visualizza la Richiesta

**Request**: `Rimborsi` → `Dettaglio Rimborso`

Sostituisci `{{richiestaId}}` con l'ID copiato.

---

### Step 5: Modifica la Richiesta (Dipendente)

**Request**: `Rimborsi` → `Modifica Richiesta`

La richiesta deve essere in stato "In attesa".

---

### Step 6: Login come Responsabile

Cambia le credenziali per:
```json
{
  "email": "andrea.verdi@company.com",
  "password": "password123"
}
```

---

### Step 7: Approva la Richiesta (Responsabile)

**Request**: `Rimborsi` → `Approva Richiesta`

**Risultato**: Stato cambia a "Approvata"

---

### Step 8: Liquida la Richiesta (Responsabile)

**Request**: `Rimborsi` → `Liquida Richiesta`

**Risultato**: Stato cambia a "Liquidata"

---

### Step 9: Visualizza Statistiche (Responsabile)

**Request**: `Statistiche` → `Statistiche Rimborsi`

Query parameters:
```
mese=2026-06
categoriaId=(opzionale)
dipendenteId=(opzionale)
```

**Risultato**: Dati aggregati per mese e categoria

---

## Credenziali di Test

### Dipendente
- **Email**: `mario.rossi@company.com`
- **Password**: `password123`
- **Ruolo**: Dipendente

### Dipendente 2
- **Email**: `giulia.bianchi@company.com`
- **Password**: `password123`
- **Ruolo**: Dipendente

### Responsabile Amministrativo
- **Email**: `andrea.verdi@company.com`
- **Password**: `password123`
- **Ruolo**: Responsabile amministrativo

### Responsabile 2
- **Email**: `laura.neri@company.com`
- **Password**: `password123`
- **Ruolo**: Responsabile amministrativo

---

## Endpoint Disponibili

### Autenticazione
- `POST /utenti/register` - Registrazione nuovo utente
- `POST /utenti/login` - Login

### Rimborsi
- `GET /rimborsi` - Elenco rimborsi (filtrabili)
- `GET /rimborsi/{id}` - Dettaglio rimborso
- `POST /rimborsi` - Crea rimborso
- `PUT /rimborsi/{id}` - Modifica rimborso
- `DELETE /rimborsi/{id}` - Elimina rimborso
- `PUT /rimborsi/{id}/approva` - Approva (solo responsabili)
- `PUT /rimborsi/{id}/rifiuta` - Rifiuta (solo responsabili)
- `PUT /rimborsi/{id}/liquida` - Liquida (solo responsabili)

### Categorie
- `GET /categorie-spesa` - Elenco categorie

### Statistiche
- `GET /statistiche/rimborsi` - Statistiche (solo responsabili)

### Health
- `GET /health` - Health check

---

## Note

- **Token**: Valido per 7 giorni
- **CORS**: Abilitato per `https://app-iasella-davide.onrender.com`
- **Validazioni**: Tutte eseguite lato server
- **Autorizzazioni**: Controllate dal backend basandosi sul ruolo

---

## Troubleshooting

**"Token non valido"**
- Fai login di nuovo
- Copia il nuovo token

**"Accesso negato"**
- Verifica di avere il ruolo corretto
- Alcuni endpoint richiedono "Responsabile amministrativo"

**"CORS error"**
- Assicurati che `baseUrl` sia corretto
- Verifica che il backend sia online

**"Richiesta non trovata"**
- L'ID potrebbe essere scaduto
- Crea una nuova richiesta

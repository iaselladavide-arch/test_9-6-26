# Gestione Rimborsi Spese Aziendali

Applicazione web full stack per la gestione delle richieste di rimborso spese aziendali.

## Tecnologie

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Autenticazione**: JWT

## Setup Locale

### Backend

1. Naviga nella cartella backend:
```bash
cd backend
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `.env` con le variabili:
```bash
cp .env.example .env
```

4. Modifica `.env` con le tue credenziali MongoDB e chiave JWT

5. Avvia il server:
```bash
npm run dev
```

Il backend sarà disponibile su `http://localhost:5000`

### Frontend

1. Naviga nella cartella frontend:
```bash
cd frontend
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il dev server:
```bash
npm run dev
```

Il frontend sarà disponibile su `http://localhost:5173`

## Deploy

### Backend su Render

1. Accedi a [render.com](https://render.com)
2. Crea un nuovo servizio "Web Service"
3. Connetti il tuo repository GitHub
4. Seleziona il branch main
5. Configura:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

6. Aggiungi le variabili d'ambiente:
   - `MONGODB_URI`: La tua stringa di connessione MongoDB
   - `JWT_SECRET`: Una chiave segreta forte
   - `NODE_ENV`: `production`

7. Deploy!

**URL del Backend**: `https://app-davide-iasella.onrender.com`

### Frontend su Vercel

1. Accedi a [vercel.com](https://vercel.com)
2. Importa il tuo repository GitHub
3. Configura:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Aggiungi le variabili d'ambiente:
   - `VITE_API_BASE_URL`: `https://app-davide-iasella.onrender.com/api`

5. Deploy!

**URL del Frontend**: `https://app-davide-iasella.vercel.app`

## Credenziali di Test (iniziali)

Il database viene inizializzato automaticamente con:

- **Dipendente**: mario.rossi@company.com / password123
- **Responsabile**: andrea.verdi@company.com / password123

Puoi creare nuovi account via registrazione.

## Struttura del Progetto

```
.
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   └── .env
└── README.md
```

## API Endpoints

### Autenticazione
- `POST /api/utenti/register` - Registrazione
- `POST /api/utenti/login` - Login

### Rimborsi
- `GET /api/rimborsi` - Lista richieste
- `POST /api/rimborsi` - Crea richiesta
- `GET /api/rimborsi/{id}` - Dettaglio richiesta
- `PUT /api/rimborsi/{id}` - Modifica richiesta
- `DELETE /api/rimborsi/{id}` - Elimina richiesta
- `PUT /api/rimborsi/{id}/approva` - Approva
- `PUT /api/rimborsi/{id}/rifiuta` - Rifiuta
- `PUT /api/rimborsi/{id}/liquida` - Liquida

### Categorie
- `GET /api/categorie-spesa` - Lista categorie

### Statistiche
- `GET /api/statistiche/rimborsi` - Statistiche (solo responsabili)

## Funzionalità

### Dipendente
- Registrazione e login
- Creazione, modifica, eliminazione richieste (solo in attesa)
- Visualizzazione richieste personali
- Filtri per stato, categoria, mese
- Visualizzazione stato avanzamento

### Responsabile Amministrativo
- Visualizzazione tutte le richieste
- Approvazione/rifiuto richieste
- Registrazione liquidazione
- Visualizzazione statistiche per mese, categoria, dipendente
- Filtri avanzati

## Note sulla Sicurezza

- Le password sono hashed con bcrypt
- Autenticazione tramite JWT
- Validazioni lato server
- CORS configurato
- Protección delle rotte per ruolo

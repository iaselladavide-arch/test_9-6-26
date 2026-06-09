# Guida Deploy - Davide Iasella

## URL Finali
- **Backend**: https://app-davide-iasella.onrender.com
- **Frontend**: https://app-davide-iasella.vercel.app

## Step 1: Preparare GitHub

1. Crea un repository su GitHub
2. Clona questo progetto nel tuo repo:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/TUO_REPO.git
git push -u origin main
```

## Step 2: Deploy Backend su Render

1. Vai a https://render.com e accedi (o registrati con GitHub)

2. Clicca su "New +" > "Web Service"

3. Seleziona "Connect a repository" e scegli il tuo repo

4. Configura:
   - **Name**: `app-davide-iasella`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
   - **Branch**: main

5. Scorri fino a "Environment":
   - Clicca "Add Environment Variable"
   - Aggiungi:
     ```
     Key: MONGODB_URI
     Value: mongodb+srv://iasella_db_user:557QmUu5NBy45ex9@camposportivodatabase.igm6ipb.mongodb.net/Prova_d'esame
     
     Key: JWT_SECRET
     Value: davide_iasella_secret_key_2026
     
     Key: NODE_ENV
     Value: production
     ```

6. Clicca "Create Web Service"

7. Aspetta il deploy (2-3 minuti). Quando vedi "Your service is live", annota l'URL:
   - Dovrebbe essere simile a: `https://app-davide-iasella.onrender.com`

## Step 3: Deploy Frontend su Vercel

1. Vai a https://vercel.com e accedi (o registrati con GitHub)

2. Clicca su "Add New..." > "Project"

3. Seleziona il tuo repository GitHub

4. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. In "Environment Variables", aggiungi:
   ```
   Key: VITE_API_BASE_URL
   Value: https://app-davide-iasella.onrender.com/api
   ```

6. Clicca "Deploy"

7. Aspetta il deploy. Quando vedi "Congratulations", annota l'URL:
   - Dovrebbe essere simile a: `https://app-davide-iasella.vercel.app`

## Step 4: Test

1. Apri https://app-davide-iasella.vercel.app

2. Accedi con:
   - **Email**: mario.rossi@company.com
   - **Password**: password123

3. Testa le funzionalità:
   - Creazione richiesta
   - Visualizzazione lista
   - Filtri
   - Logout e riaccess

## Troubleshooting

### Backend non risponde
- Controlla le variabili d'ambiente su Render
- Verifica che MongoDB sia accessibile
- Vedi i log su Render Dashboard

### Frontend non trova il backend
- Assicurati che VITE_API_BASE_URL sia impostato correttamente
- Controlla la console browser (DevTools) per errori CORS
- Verifica che il backend sia online

### Errori di build
- Assicurati che tutti i file siano committati su GitHub
- Verifica che package.json sia nella cartella corretta
- Controlla i log di build su Render/Vercel

## Aggiornamenti Futuri

Quando pushare nuovi commit su main, i deploy automatici si attiverà:

```bash
git add .
git commit -m "Descrizione cambiamenti"
git push origin main
```

Render e Vercel deployer automaticamente i nuovi cambiamenti!

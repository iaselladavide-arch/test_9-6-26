require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

if (!process.env.MONGODB_URI) {
  console.error('ERRORE: MONGODB_URI non definito nelle variabili d\'ambiente');
  process.exit(1);
}

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://app-iasella-davide.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://app-iasella-davide.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connesso a MongoDB');
    initializeDatabase();
  })
  .catch(err => {
    console.error('❌ Errore MongoDB:', err.message);
    console.error('Retrying connection...');
    setTimeout(() => {
      mongoose.connect(process.env.MONGODB_URI);
    }, 5000);
  });

app.use('/api/utenti', require('./routes/auth'));
app.use('/api/rimborsi', require('./routes/rimborsi'));
app.use('/api/categorie-spesa', require('./routes/categorie'));
app.use('/api/statistiche', require('./routes/statistiche'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Errore interno del server' });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server avviato su ${HOST}:${PORT}`);
});

async function initializeDatabase() {
  try {
    const CategoriaSpesa = require('./models/CategoriaSpesa');
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const categorieCount = await CategoriaSpesa.countDocuments();
    if (categorieCount === 0) {
      const categorie = [
        { descrizione: 'Trasferta' },
        { descrizione: 'Pasti' },
        { descrizione: 'Pedaggi' },
        { descrizione: 'Parcheggi' },
        { descrizione: 'Acquisti autorizzati' },
        { descrizione: 'Altro' }
      ];
      await CategoriaSpesa.insertMany(categorie);
      console.log('Categorie inizializzate');
    }

    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const users = [
        {
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario.rossi@company.com',
          password: hashedPassword,
          ruolo: 'Dipendente'
        },
        {
          nome: 'Giulia',
          cognome: 'Bianchi',
          email: 'giulia.bianchi@company.com',
          password: hashedPassword,
          ruolo: 'Dipendente'
        },
        {
          nome: 'Andrea',
          cognome: 'Verdi',
          email: 'andrea.verdi@company.com',
          password: hashedPassword,
          ruolo: 'Responsabile amministrativo'
        },
        {
          nome: 'Laura',
          cognome: 'Neri',
          email: 'laura.neri@company.com',
          password: hashedPassword,
          ruolo: 'Responsabile amministrativo'
        }
      ];

      await User.insertMany(users);
      console.log('Utenti di test inizializzati');
      console.log('Credenziali di test:');
      console.log('- mario.rossi@company.com (Dipendente)');
      console.log('- giulia.bianchi@company.com (Dipendente)');
      console.log('- andrea.verdi@company.com (Responsabile)');
      console.log('- laura.neri@company.com (Responsabile)');
      console.log('Password per tutti: password123');
    }
  } catch (error) {
    console.error('Errore nell\'inizializzazione del database:', error);
  }
}

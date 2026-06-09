const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nome, cognome, email, password, confirmPassword, ruolo } = req.body;

    if (!nome || !cognome || !email || !password) {
      return res.status(400).json({ error: 'Tutti i campi obbligatori devono essere riempiti' });
    }

    if (nome.trim().length === 0 || cognome.trim().length === 0) {
      return res.status(400).json({ error: 'Nome e cognome non possono contenere solo spazi' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Le password non coincidono' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La password deve essere lunga almeno 6 caratteri' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      nome: nome.trim(),
      cognome: cognome.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      ruolo: ruolo || 'Dipendente'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, ruolo: user.ruolo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrazione completata',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono obbligatori' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenziali errate' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenziali errate' });
    }

    const token = jwt.sign(
      { userId: user._id, ruolo: user.ruolo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login completato',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

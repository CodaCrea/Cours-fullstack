const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!user || !valid) {
      return res.status(401).json({ message: "Email d'utilisateur ou mot de passe incorrect" });
    }
    res.status(200).json({
      userId: user._id,
      token: jwt.sign(
        { userId: user._id },
        // Clé qui est dans ".env"
        process.env.tokenKey,
        { expiresIn: '24h' }
      )
    });
  } catch (error) {
    res.status(500).json({ error });
  };
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
  const hash = bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hash
  });
  try {
    const result = await user.save();
    console.log(result);
    if (result) {
      res.status(201).json({ message: 'Utilisateur créé !' });
    } else {
      res.status(400).json({ result });
    }
  }
  catch (error) {
    res.status(500).json({ error });
  };
}

exports.login = async (req, res, next) => {
  try {
    User.findOne({ email: req.body.email })
      (user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          (valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
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
          })
      })
  }
  catch (error) {
    res.status(500).json({ error });
  }
};
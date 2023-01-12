const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // Récupérer la propiété "authorization" et prendre le 2ème index avec "split" (le mot de passe crypté)
    const token = req.headers.authorization.split(' ')[1];
    // Vérifier le token aux informations d'authentification de l'utilisateur
    const decodedToken = jwt.verify(token, process.env.tokenKey);
    const userId = await decodedToken.userId;
    req.auth = {
      userId: userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      error
    })
  }
}
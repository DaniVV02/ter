const jwt = require("jsonwebtoken");

module.exports.auth = TokenChecking;
module.exports.signIn = TokenSignIn;

function TokenChecking(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) throw new Error("Token d'authentification manquant");

    const decodedToken = jwt.verify(token, process.env.DEV_KEY, {
      algorithm: "HS256",
    }); // ? : dev key

    const username = decodedToken.username;
    req.auth = {
      username: username,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
}

function TokenSignIn(data, res) {
  try {
    var params = {
      algorithm: "HS256",
      expiresIn: "24h", // ? test in seconds
    };
    return jwt.sign(data, process.env.DEV_KEY, params);
  } catch (error) {
    res.status(401).json({ error });
  }
}

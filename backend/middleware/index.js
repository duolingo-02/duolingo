const jwt = require("jsonwebtoken");
require("dotenv").config();

// MiddleWare Here we will need auth for now

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authorization header missing ");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
  if (!token) {
    console.log("Token extraction failed");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed");
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log(decoded, "====== decoded ======");
    req.user = decoded;
    next();
  });
};

// Middleware pour capturer les messages des réponses API
const apiMessageHandler = (req, res, next) => {
  // Intercepter la méthode 'send' et 'json' d'Express
  const originalSend = res.send;
  const originalJson = res.json;

  // Intercepter 'res.send'
  res.send = function (body) {
    captureMessage(res.statusCode, body);
    return originalSend.call(this, body); // Appeler l'originale
  };

  // Intercepter 'res.json'
  res.json = function (body) {
    captureMessage(res.statusCode, body);
    return originalJson.call(this, body); // Appeler l'originale
  };

  // Fonction pour capturer et loguer le message et le statut
  const captureMessage = (statusCode, body) => {
    if (body && typeof body === "object" && body.message) {
      console.log(`API Response [${statusCode}]: ${body.message}`);
    } else {
      console.log(
        `API Response [${statusCode}]: Response without a specific message.`
      );
    }
  };
  console.log("Internal Server Error:", res.stack);
  // Passer au middleware suivant

  // Passer au middleware suivant
  next();
};

module.exports = {
  authenticate,
  apiMessageHandler,
};

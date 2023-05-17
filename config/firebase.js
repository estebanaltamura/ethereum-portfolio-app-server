const admin = require("firebase-admin")


const serviceAccount = require('./firebase-admins.json'); // Ruta al archivo JSON de la clave de servicio

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ethereum-portfolio-app.firebaseio.com' // URL de tu base de datos Firebase
});


const db = admin.firestore();

module.exports = db


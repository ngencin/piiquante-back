const express = require('express'); // récupération package express qui permet de gérer l'application
const mongoose = require('mongoose'); // récupération package mongoose qui permet de récupérer la base données MongoDB
const path = require('path') // récupération du chemin des images
const dotenv = require("dotenv") // permet de charger les variables d'environnement
dotenv.config()

const sauceRoutes = require('./routes/sauce') // récupération du fichier sauce
const userRoutes = require('./routes/user') // récupération du fichier user


// connexion base de données 
mongoose.connect( process.env.MONGO_DB, // connexion mongoose via mongoDB database 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
 



const app = express();
app.use(express.json());

  app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/sauces', sauceRoutes)
  app.use('/api/auth', userRoutes)
  
  app.use('/images', express.static(path.join(__dirname, 'images')))


module.exports = app;
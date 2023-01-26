const jwt = require('jsonwebtoken') //récupération package json web token qui permet l'échange sécurisé de jetons entre plusieurs parties
const dotenv = require("dotenv") // permet de charger les variables d'environnement
dotenv.config()

//middleware qui permet d'extraire les informations contenues dans le Token et vérification du Token si il est valide
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] // récupération du token 
        const decodedToken = jwt.verify(token, process.env.APP_SECRET) // decodage du token 
        const userId = decodedToken.userId // récupération du userId 
        req.auth = { // requête transmise aux routes 
            userId: userId
        }
        next() // si tout fonctionne on exécute 
    } catch (error) {
        res.status(401).json({ error })

    }
}

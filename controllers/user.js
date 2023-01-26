const bcrypt = require('bcrypt') // hash de mot de passe
const jwt = require('jsonwebtoken'); // création de TOKEN + vérification 
const dotenv = require("dotenv");
dotenv.config();


const User = require('../models/User')


// inscription nouvel utilisateur, fonction cryptage du mot de passe 
exports.signup = (req, res, next) => {
    User.findOne({ email: req.body.email }) // permet de savoir si l'email est connu dans la base de données
        .then(user => {
            if (user !== null) { // si l'utilisateur existe dans la base de données un message d'erreur s'affiche
                res.status(400).json({ message: 'Utilisateur déjà créé' })
            } else {
                bcrypt.hash(req.body.password, 10)// mot de passe recueilli du frontend - 10 tours plus de sécurité
                    .then(hash => {
                        const user = new User({ // nouvel utilisateur email et mot de passe crypté
                            email: req.body.email, // email passé dans le CORS de la requête 
                            password: hash // mot de passe crypté

                        })


                        user.save() // enregistrement de l'utilisateur dans la base de données
                            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                            .catch(error => res.status(400).json({ error }))

                    })
            }
        })




        .catch(error => res.status(500).json({ error }))  // erreur 500 côté serveur

}

// connexion de l'utilisateur déjà inscrit 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // permet de savoir si l'email est connu dans la base de données
        .then(user => {
            if (user === null) { // si l'utilisateur est non existant dans la base de données
                res.status(401).json({ message: 'Identifiant/mot de passe incorrecte' })
            } else {
                bcrypt.compare(req.body.password, user.password) // comparaison du mot de passe entré par l'utilisateur au moment de l'inscription

                    .then(valid => {
                        if (!valid) {  // erreur authentification
                            res.status(401).json({ message: 'Identifiant/mot de passe incorrecte' })
                        } else {
                            res.status(200).json({ //informations nécessaire pour l'authentification
                                userId: user._id,
                                token: jwt.sign( // vérifier chaque requête d'authentification
                                    { userId: user._id },  // identifiant utilisateur du user
                                    process.env.APP_SECRET, // clé secrète encodage
                                    { expiresIn: '24h' } // configuration d'une expiration du TOKEN
                                )
                            })
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error }) // erreur de traitement
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
}
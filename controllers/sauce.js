
const Sauce = require('../models/Sauce') // import fichier Sauce
const fs = require('fs') // méthode qui permet de supprimer un fichier


// fonction qui permet de récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
  }
  
// fonction qui permet de créer une sauce
  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id 
    delete sauceObject._userId 
    const sauce = new Sauce ({
        ...sauceObject,
        _userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
   }

// fonction qui récupére une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
  }

// fonctin qui permet de modifier une sauce
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // modifier l'image
    } : { ...req.body} 
    delete sauceObject._userId // supprime l'ancienne version de la sauce  
    Sauce.findOne({_id: req.params.id}) // récupération d'un id d'une sauce
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) { // /empêche l'utilisateur de modifier la sauce si elle n'a pas été ajoutée par lui-même
            res.status(401).json({message: 'Non autorisé'})
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // récupération de l'id de la sauce ainsi que de l'id de l'utilisateur original
            .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) // la sauce pourra être modifiée 
            .catch(error => res.status(401).json({ error }))
        }
    })
    .catch(error => { res.status(400).json( { error })})
}

// fonction qui permet d'aimer / ou non une sauce 
exports.likedislikeSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params.id})
  }

// fonction qui permet de supprimer une sauce
  exports.deleteSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params})
    .then(() => {
        if (sauce.userId != req.auth.userId) { //empêche l'utilisateur de supprimer la sauce si elle n'a pas été ajoutée par lui-même
            res.status(401).json({ message: 'Non autorisé'})
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => { // suppression de l'image
                Sauce.deleteOne({ _id: req.params.id}) // supression de la sauce en question
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(401).json({ error }))
                
            })
        }
    })
    .catch(error => res.status(500).json({ error }))
  }


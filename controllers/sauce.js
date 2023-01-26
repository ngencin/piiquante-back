
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
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  })


  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ error }) })
}

// fonction qui récupére une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

// fonctin qui permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // modifie l'image
  } : { ...req.body }
  delete sauceObject._userId
  Sauce.findOne({ _id: req.params.id }) // récupération d'un id d'une sauce
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { // /empêche l'utilisateur de modifier la sauce si l'userId est différent de celui qui a crée la sauce
        res.status(403).json({ message: 'Demande non authorisée' })
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // récupération de l'id de la sauce ainsi que de l'id de l'utilisateur original
          .then(() => res.status(200).json({ message: 'Sauce modifiée !' })) // la sauce pourra être modifiée 
          .catch(error => res.status(401).json({ error }))
      }
    })
    .catch(error => { res.status(400).json({ error }) })
}

// fonction qui permet d'aimer / ou non une sauce 
exports.likedislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // récupération d'un id d'une sauce
    .then((sauce) => {
      // like de la sauce
      if (!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1) { // si l'userId n'est pas présent dans usersLiked on ajoute son like
        Sauce.updateOne( // mise à jour dans la base de données
          { _id: req.params.id },
          {
            $inc: { likes: 1 }, // opérateur incrément mongodb a +1
            $push: { usersLiked: req.auth.userId } // opérateur push qui ajoute le userId au userLiked
          })
          .then(() => res.status(201).json({ message: 'Sauce likée' }))
          .catch(error => res.status(404).json({ error }))
      } else if
        // Dislike de la sauce 
        (!sauce.usersDisliked.includes(req.auth.userId) && req.body.like === -1) { // si l'userId n'est pas présent dans usersDisliked on ajoute son dislike
        Sauce.updateOne( // mise à jour dans la base de données
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 }, // opérateur incrément a +1
            $push: { usersDisliked: req.auth.userId } // opérateur push qui ajoute le userId au usersDisliked
          })
          .then(() => res.status(201).json({ message: 'Sauce Dislikée' }))
          .catch(error => res.status(404).json({ error }))
      } else {
        // Annulation du like
        if (sauce.usersLiked.includes(req.auth.userId)) { // si l'userId est présent dans le usersliked il faut l'enlever du usersLiked
          Sauce.updateOne( // mise à jour de la base de données
            { _id: req.params.id },
            {
              $inc: { likes: -1 },  // opérateur incrément on enlève 1 pour revenir à 0
              $pull: { usersLiked: req.auth.userId }, // opérateur pull qui permet la suppression du userId dans usersLiked
            })
            .then(() => res.status(201).json({ message: 'Annulation du like' }))
            .catch(error => res.status(404).json({ error }))
        } else if
          // Annulation du dislike
          (sauce.usersDisliked.includes(req.auth.userId)) { // si l'userId est présent dans le usersDisliked il faut l'enlever 
          Sauce.updateOne( // mise à jour de la base de données
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },  // opérateur incrément on enlève 1 pour revenir à 0
              $pull: { usersDisliked: req.auth.userId }, // opérateur pull qui permet la suppression du userId dans usersDisliked
            })
            .then(() => res.status(201).json({ message: 'Annulation du dislike' }))
            .catch(error => res.status(404).json({ error }))
        }
      }
    })
    .catch(error => res.status(400).json({ error }))
}

// fonction qui permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { //empêche l'utilisateur de supprimer la sauce si l'userId est différent de celui qui a créé la sauce
        res.status(403).json({ message: 'Demande non autorisée' })
      } else {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`./images/${filename}`, () => { // suppression de l'image
          Sauce.deleteOne({ _id: req.params.id }) // supression de la sauce 
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(401).json({ error }))

        })
      }
    })
    .catch(error => res.status(500).json({ error }))
}

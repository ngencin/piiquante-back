const passwordValidator = require('password-validator')// import de password-validator

// création du schema 

const passwordSchema = new passwordValidator()

// le schema que le mot de passe doit respecter
passwordSchema
.is().min(8)                                    // Minimum 8 caractères 
.is().max(15)                                  // Maximum 15 caractères
.has().uppercase()                              // Lettres en majuscules autorisées
.has().lowercase()                              // Lettres en minuscules autorisées
.has().digits(2)                                // Mettre deux chiffres minimum
.has().not().spaces()                           // Espaces non autorisés
.is().not().oneOf(['Passw0rd', 'Password123']); // Mots interdit


// vérfication du mot de passe

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next()
    } else
   return res.status(400).json({ message: `Le mot de passe n'est pas assez fort`})
}
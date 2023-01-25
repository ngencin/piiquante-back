// Modèle qui empêche un utilisateur d'utiliser la même adresse mail
const mongoose = require('mongoose') // 
const uniqueValidator = require('mongoose-unique-validator') // assure que l'email enregistré dans la base de données est unique
const mongodbErrorHandler = require('mongoose-mongodb-errors') // signale les erreurs type MongoDb en instances de Mongoose ValidationError


const userSchema = mongoose.Schema({ // fonction schema, informations a stocker
  email: { type: String, required: true, unique: true }, // unique = pas de possibilités d'inscription avec le même email
  password: { type: String, required: true }
})



userSchema.plugin(uniqueValidator);
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema) // fonction model, model user, schema de données 
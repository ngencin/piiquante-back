// Modèle qui empêche un utilisateur d'utiliser la même adresse mail
const mongoose = require('mongoose'); // 
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({ // fonction schema, informations a stocker
  email: { type: String, required: true, unique: true }, // unique = pas de possibilités d'inscription avec le même email
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); // fonction model, model user, schema de données 
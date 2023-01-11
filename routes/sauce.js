const express= require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


const sauceCtrl = require('../controllers/sauce')

router.get('/', auth, sauceCtrl.getAllSauce ) // route qui va récupérer toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce) // route qui va créer une sauce 
router.get('/:id', auth, sauceCtrl.getOneSauce) // route qui va récupérer une sauce 
router.put('/:id', auth, multer, sauceCtrl.modifySauce) // route qui va modifier une sauce 
router.post('/:id/like', auth, sauceCtrl.likedislikeSauce) // route qui va permettre de liker ou non une sauce 
router.delete('/:id', auth, sauceCtrl.deleteSauce) // route qui va supprimer une sauce 

 

module.exports = router
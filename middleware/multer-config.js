const multer = require('multer') // récupération package multer qui permet de gérer les fichiers

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_') // .split et .join remplace les espaces par _
    const extension = MIME_TYPES[file.mimetype] // nom de fichier avec l'extension
    callback(null, name + Date.now() + '.' + extension) // rendre unique le nom de fichier
  }
})

module.exports = multer({ storage: storage }).single('image') // configurer le multer

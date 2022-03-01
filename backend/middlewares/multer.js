// Multer pour gérer les images
const multer = require('multer') 


const multerConfig = multer.diskStorage({
    // localisation du fichier enregistré
    destination: (req, file, callback) => {
        callback(null, '../frontend/public/')    
    },
    // nom du fichier
    filename: (req, file, callback) => {
        
        const ext = file.mimetype.split('/')[1] 
        callback(null, `image-${Date.now()}.${ext}`) 
    }
})

// Est ce que c'est une image?
const isImage = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new Error('Image seulement !'))
    }
}

// Config de multer
const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})

exports.uploadImage = upload.single('photo')
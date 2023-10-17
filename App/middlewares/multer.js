const multer = require('multer')
const path = require('path')
const {v4 : uuidv4} = require('uuid')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null,`${Date.now()}-${file.originalname}-${path.extname(file.originalname)}`)
//     }
// })

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/png', 'image/jpeg','image/jpg', 'application/pdf']
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(null, false)
    }
}
const uploads = multer({storage, fileFilter})

module.exports = uploads

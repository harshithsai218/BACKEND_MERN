const multer = require('multer');
const { v4: uuid } = require('uuid');


const MIME_Type_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
};

const fileUpload = multer({
    limits:500000,
    storage: multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null,'Uploads/Images')
        },
        filename: (req,file,cb)=>{
            const ext = MIME_Type_MAP[file.mimetype]
            cb(null,uuid()+'.'+ext)
        }
    }),
    fileFilter : (req,file,cb)=>{
        const isValid = !!MIME_Type_MAP[file.mimetype];
        let error =isValid? null:new Error('invalid mime type!')
        cb(error,isValid);
    }
});



module.exports=fileUpload;
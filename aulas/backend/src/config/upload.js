const multer = require('multer');
const path = require('path');

module.exports = {
    storage: new multer.diskStorage({
        //rota destino da imagem
        destination: path.resolve(__dirname, '..', '..', 'uploads'),

        //nome da imagem na pasta destino        
        filename: function(req, file, cb){
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);

            cb(null, `${name}-${Date.now()}${ext}`);
        }
    })
};
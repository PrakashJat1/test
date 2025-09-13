import multer from 'multer';

const storage = multer.memoryStorage(); //use RAM for storage 
const upload = multer({storage});

export default upload;
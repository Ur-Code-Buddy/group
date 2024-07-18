import multer, { MulterError } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req: any, file : any, cb :any) => {
        cb(null, path.join(__dirname, '../../uploads/')); //where is the file getting uploaded
    },
    filename: (req: any, file : any, cb :any) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });
  
export default upload;
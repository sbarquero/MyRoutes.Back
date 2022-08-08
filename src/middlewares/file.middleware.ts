import multer from 'multer';

export const uploadFileToDisk = () => {
  const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (_req, file, cb) {
      const extension = file.originalname.slice(file.originalname.lastIndexOf('.'));
      const name = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
      cb(null, name + '-' + Date.now() + extension);
    },
  });

  const upload = multer({ storage }).single('file');

  return upload;
};

export const uploadFileToMemory = () => {
  const storage = multer.memoryStorage();

  const upload = multer({ storage }).single('file');

  return upload;
};

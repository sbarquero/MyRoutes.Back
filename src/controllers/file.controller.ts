import { NextFunction, Request, Response } from 'express';
import FileService from '@/services/file.service';
import { FileUploadDto } from '@/dtos/file.dto';

class FileController {
  public upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileData: FileUploadDto = {
        file: req.file?.buffer,
        userId: req.body.userId,
      };

      const fileService = new FileService();
      await fileService.upload(fileData);

      res.status(200).send({ message: 'File uploaded' });
    } catch (error) {
      next(error);
    }
  };
}

export default FileController;

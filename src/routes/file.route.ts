import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import FileController from '@/controllers/file.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import { FileUploadDto } from '@/dtos/file.dto';
import { uploadFileToMemory } from '@/middlewares/file.middleware';

class FileRoute implements Routes {
  public router = Router();
  public path = '/file';
  public fileController = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/upload`,
      uploadFileToMemory(),
      validationMiddleware(FileUploadDto, 'body'),
      this.fileController.upload,
    );
  }
}

export default FileRoute;

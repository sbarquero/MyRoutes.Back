import { FileUploadDto } from '@/dtos/file.dto';
import { HttpException } from '@/exceptions/HttpException';
import userModel from '@models/users.model';

class FileService {
  public users = userModel;

  public async upload(data: FileUploadDto): Promise<void> {
    if (!data.file) throw new HttpException(400, 'File is required');

    const findUser = await this.users.findById(data.userId);
    if (!findUser) throw new HttpException(404, `UserId '${data.userId}' not found`);

    // TODO: pending development
    console.log('file', data);
  }
}

export default FileService;

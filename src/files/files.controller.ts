import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { FileElementResponse } from '@app/files/DTO/file-element.response';
import { FilesService } from '@app/files/files.service';
import { MFile } from '@app/files/mfile.class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)];
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer);
      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
        }),
      );
    }
    return this.filesService.saveFiles(saveArray);
  }
}

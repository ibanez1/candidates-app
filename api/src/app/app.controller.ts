import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CandidateInfo, Candidate, ApiResponse } from '@org/models';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('candidates')
  @UseInterceptors(FileInterceptor('excel'))
  createCandidate(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('surname') surname: string,
    @UploadedFile() excel: MulterFile
  ): ApiResponse<Candidate> {
    const candidateInfo: CandidateInfo = {
      id: parseInt(id),
      name: name,
      surname: surname,
      excel: excel?.buffer
    };
    return this.appService.createCandidate(candidateInfo);
  }
}

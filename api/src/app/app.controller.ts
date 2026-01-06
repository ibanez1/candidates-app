import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CandidateInfo, Candidate, ApiResponse } from '@org/models';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('candidates')
  createCandidate(@Body() candidateInfo: CandidateInfo): ApiResponse<Candidate> {
    return this.appService.createCandidate(candidateInfo);
  }
}

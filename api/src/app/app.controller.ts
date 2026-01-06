import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CandidateInfo, Candidate, ApiResponse } from '@org/models';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('candidates')
  createCandidate(@Body() candidateInfo: CandidateInfo): ApiResponse<Candidate> {
    return this.appService.createCandidate(candidateInfo);
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CandidateInfo, Candidate, ApiResponse } from '@org/models';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  createCandidate(candidateInfo: CandidateInfo): ApiResponse<Candidate> {
    // Validate fields required
    if (!candidateInfo.name || !candidateInfo.surname || candidateInfo.id === undefined || candidateInfo.id === null) {
      throw new HttpException(
        {
          success: false,
          error: 'Missing required fields: id, name, and surname are required',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate that id is a number
    if (typeof candidateInfo.id !== 'number' || isNaN(candidateInfo.id)) {
      throw new HttpException(
        {
          success: false,
          error: 'Invalid id: must be a number',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate that name is at most 100 characters
    if (candidateInfo.name.length > 100) {
      throw new HttpException(
        {
          success: false,
          error: 'Invalid name: must be 100 characters or less',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Validate that surname is at most 100 characters
    if (candidateInfo.surname.length > 100) {
      throw new HttpException(
        {
          success: false,
          error: 'Invalid surname: must be 100 characters or less',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Create the candidate with default values for optional fields
    const candidate: Candidate = {
      id: candidateInfo.id,
      name: candidateInfo.name.trim(),
      surname: candidateInfo.surname.trim(),
      seniority: 'junior', // valor por defecto
      years: 0,            // valor por defecto
      availability: true   // valor por defecto
    };

    return {
      success: true,
      data: candidate,
      message: 'Candidate created successfully'
    };
  }
}

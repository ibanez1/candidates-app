import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CandidateInfo, Candidate, ApiResponse } from '@org/models';
import * as XLSX from 'xlsx';

@Injectable()
export class AppService {

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

    // Validate that excel file is provided
    if (!candidateInfo.excel) {
      throw new HttpException(
        {
          success: false,
          error: 'Excel file is required',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    let seniority: 'junior' | 'senior';
    let years: number;
    let availability: boolean;

    try {
      // Read the Excel file (assuming it comes as a Buffer or base64)
      const workbook = XLSX.read(candidateInfo.excel, { type: 'buffer' });

      // Validate that it has at least one sheet
      if (workbook.SheetNames.length === 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Excel file is empty',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Read the first sheet
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

      // Validate that it has content
      if (jsonData.length === 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Excel file has no data',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that it has exactly 3 columns
      const firstRow = jsonData[0];
      if (!firstRow || firstRow.length !== 3) {
        throw new HttpException(
          {
            success: false,
            error: 'Excel file must have exactly 3 columns',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that the columns are correct
      const requiredColumns = ['seniority', 'years of experience', 'availability'];
      const actualColumns = firstRow.map((col: any) => 
        String(col || '').toLowerCase().trim()
      );
      
      const hasAllColumns = requiredColumns.every(reqCol => 
        actualColumns.includes(reqCol)
      );

      if (!hasAllColumns) {
        throw new HttpException(
          {
            success: false,
            error: 'Excel must have columns: Seniority, Years of experience, Availability',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that it has exactly 2 rows (1 header + 1 data row)
      if (jsonData.length !== 2) {
        throw new HttpException(
          {
            success: false,
            error: 'Excel must have exactly 1 data row (plus headers)',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that the data row has exactly 3 values
      const dataRow = jsonData[1];
      if (!dataRow || dataRow.length !== 3) {
        throw new HttpException(
          {
            success: false,
            error: 'Data row must have exactly 3 values in the correct columns',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that all data cells are filled
      const hasEmptyValues = dataRow.some((value: any) => 
        value === null || value === undefined || String(value).trim() === ''
      );

      if (hasEmptyValues) {
        throw new HttpException(
          {
            success: false,
            error: 'All data cells must be filled',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that Seniority is "junior" or "senior"
      const seniorityIndex = actualColumns.indexOf('seniority');
      const seniorityValue = String(dataRow[seniorityIndex] || '').toLowerCase().trim();
      
      if (seniorityValue !== 'junior' && seniorityValue !== 'senior') {
        throw new HttpException(
          {
            success: false,
            error: 'Seniority must be "junior" or "senior"',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      seniority = seniorityValue as 'junior' | 'senior';

      // Validate that Years of experience is a number between 0 and 99
      const yearsIndex = actualColumns.indexOf('years of experience');
      const yearsValue = dataRow[yearsIndex];
      const yearsNumber = Number(yearsValue);
      
      if (isNaN(yearsNumber) || yearsNumber < 0 || yearsNumber > 99 || !Number.isInteger(yearsNumber)) {
        throw new HttpException(
          {
            success: false,
            error: 'Years of experience must be a whole number between 0 and 99',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      years = yearsNumber;

      // Validate that Availability is a valid boolean value
      const availabilityIndex = actualColumns.indexOf('availability');
      const availabilityValue = String(dataRow[availabilityIndex] || '').toLowerCase().trim();
      const validBooleanValues = ['true', 'false', '1', '0', 'yes', 'no'];
      
      if (!validBooleanValues.includes(availabilityValue)) {
        throw new HttpException(
          {
            success: false,
            error: 'Availability must be true/false, 1/0, or yes/no',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      availability = ['true', '1', 'yes'].includes(availabilityValue);

    } catch (error) {
      // If it's already an HttpException, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }
      // Otherwise, throw a generic error
      throw new HttpException(
        {
          success: false,
          error: 'Error reading Excel file',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Create the candidate with values from Excel
    const candidate: Candidate = {
      id: candidateInfo.id,
      name: candidateInfo.name.trim(),
      surname: candidateInfo.surname.trim(),
      seniority,
      years,
      availability
    };

    return {
      success: true,
      data: candidate,
      message: 'Candidate created successfully'
    };
  }
}

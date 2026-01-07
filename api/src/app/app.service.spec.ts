import { Test } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import * as XLSX from 'xlsx';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('createCandidate', () => {
    const createValidExcel = (data: (string | number | boolean)[][]): Buffer => {
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    };

    it('should create a candidate successfully with valid data', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      const candidateInfo = {
        id: 123,
        name: 'John',
        surname: 'Doe',
        excel: excelBuffer
      };

      const result = service.createCandidate(candidateInfo);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 123,
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        years: 5,
        availability: true
      });
      expect(result.message).toBe('Candidate created successfully');
    });

    it('should throw error when name is missing', () => {
      expect(() => {
        service.createCandidate({
          id: 123,
          name: '',
          surname: 'Doe',
          excel: Buffer.from('')
        });
      }).toThrow(HttpException);
    });

    it('should throw error when surname is missing', () => {
      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: '',
          excel: Buffer.from('')
        });
      }).toThrow(HttpException);
    });

    it('should throw error when id is not a number', () => {
      expect(() => {
        service.createCandidate({
          id: 'abc' as unknown as number,
          name: 'John',
          surname: 'Doe',
          excel: Buffer.from('')
        });
      }).toThrow(HttpException);
    });

    it('should throw error when name exceeds 100 characters', () => {
      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'a'.repeat(101),
          surname: 'Doe',
          excel: Buffer.from('')
        });
      }).toThrow(HttpException);
    });

    it('should throw error when surname exceeds 100 characters', () => {
      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'a'.repeat(101),
          excel: Buffer.from('')
        });
      }).toThrow(HttpException);
    });

    it('should throw error when excel file is not provided', () => {
      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: undefined as unknown as Buffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when excel file has no columns', () => {
      const excelData = [[]];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when excel file has wrong number of columns', () => {
      const excelData = [
        ['Seniority', 'Years of experience']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when excel file has incorrect column names', () => {
      const excelData = [
        ['Wrong', 'Column', 'Names']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when excel file has no data rows', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when excel file has more than 1 data row', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, 'true'],
        ['senior', 10, 'false']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when data row has empty values', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', '', 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when seniority is invalid', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['invalid', 5, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should accept "senior" as valid seniority', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['senior', 10, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      const result = service.createCandidate({
        id: 123,
        name: 'John',
        surname: 'Doe',
        excel: excelBuffer
      });

      expect(result.data.seniority).toBe('senior');
    });

    it('should throw error when years is not a number', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 'abc', 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when years is negative', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', -5, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when years exceeds 99', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 100, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when years is not an integer', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5.5, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should throw error when availability is invalid', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, 'invalid']
      ];
      const excelBuffer = createValidExcel(excelData);

      expect(() => {
        service.createCandidate({
          id: 123,
          name: 'John',
          surname: 'Doe',
          excel: excelBuffer
        });
      }).toThrow(HttpException);
    });

    it('should accept "false" as valid availability', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, 'false']
      ];
      const excelBuffer = createValidExcel(excelData);

      const result = service.createCandidate({
        id: 123,
        name: 'John',
        surname: 'Doe',
        excel: excelBuffer
      });

      expect(result.data.availability).toBe(false);
    });

    it('should accept "1" as true for availability', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, '1']
      ];
      const excelBuffer = createValidExcel(excelData);

      const result = service.createCandidate({
        id: 123,
        name: 'John',
        surname: 'Doe',
        excel: excelBuffer
      });

      expect(result.data.availability).toBe(true);
    });

    it('should accept "0" as false for availability', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, '0']
      ];
      const excelBuffer = createValidExcel(excelData);

      const result = service.createCandidate({
        id: 123,
        name: 'John',
        surname: 'Doe',
        excel: excelBuffer
      });

      expect(result.data.availability).toBe(false);
    });

    it('should trim name and surname', () => {
      const excelData = [
        ['Seniority', 'Years of experience', 'Availability'],
        ['junior', 5, 'true']
      ];
      const excelBuffer = createValidExcel(excelData);

      const result = service.createCandidate({
        id: 123,
        name: '  John  ',
        surname: '  Doe  ',
        excel: excelBuffer
      });

      expect(result.data.name).toBe('John');
      expect(result.data.surname).toBe('Doe');
    });
  });
});

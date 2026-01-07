import axios from 'axios';
import FormData from 'form-data';
import * as XLSX from 'xlsx';

describe('POST /api/candidates', () => {
  const createValidExcel = (data: any[][]): Buffer => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  };

  it('should create a candidate successfully with valid data', async () => {
    const excelData = [
      ['Seniority', 'Years of experience', 'Availability'],
      ['junior', 5, 'true']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '123');
    formData.append('name', 'John');
    formData.append('surname', 'Doe');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    const res = await axios.post(`/api/candidates`, formData, {
      headers: formData.getHeaders()
    });

    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toEqual({
      id: 123,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      years: 5,
      availability: true
    });
    expect(res.data.message).toBe('Candidate created successfully');
  });

  it('should return error when name is missing', async () => {
    const excelData = [
      ['Seniority', 'Years of experience', 'Availability'],
      ['junior', 5, 'true']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '123');
    formData.append('name', '');
    formData.append('surname', 'Doe');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    try {
      await axios.post(`/api/candidates`, formData, {
        headers: formData.getHeaders()
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  it('should return error when excel file has wrong structure', async () => {
    const excelData = [
      ['Wrong', 'Column', 'Names'],
      ['junior', 5, 'true']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '123');
    formData.append('name', 'John');
    formData.append('surname', 'Doe');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    try {
      await axios.post(`/api/candidates`, formData, {
        headers: formData.getHeaders()
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  it('should return error when seniority is invalid', async () => {
    const excelData = [
      ['Seniority', 'Years of experience', 'Availability'],
      ['invalid', 5, 'true']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '123');
    formData.append('name', 'John');
    formData.append('surname', 'Doe');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    try {
      await axios.post(`/api/candidates`, formData, {
        headers: formData.getHeaders()
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  it('should return error when years is out of range', async () => {
    const excelData = [
      ['Seniority', 'Years of experience', 'Availability'],
      ['junior', 100, 'true']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '123');
    formData.append('name', 'John');
    formData.append('surname', 'Doe');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    try {
      await axios.post(`/api/candidates`, formData, {
        headers: formData.getHeaders()
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  it('should accept senior as valid seniority', async () => {
    const excelData = [
      ['Seniority', 'Years of experience', 'Availability'],
      ['senior', 10, 'false']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '456');
    formData.append('name', 'Jane');
    formData.append('surname', 'Smith');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    const res = await axios.post(`/api/candidates`, formData, {
      headers: formData.getHeaders()
    });

    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data.seniority).toBe('senior');
    expect(res.data.data.availability).toBe(false);
  });

  it('should accept different availability formats', async () => {
    const excelData = [
      ['Seniority', 'Years of experience', 'Availability'],
      ['junior', 3, '1']
    ];
    const excelBuffer = createValidExcel(excelData);

    const formData = new FormData();
    formData.append('id', '789');
    formData.append('name', 'Bob');
    formData.append('surname', 'Johnson');
    formData.append('excel', excelBuffer, 'candidate.xlsx');

    const res = await axios.post(`/api/candidates`, formData, {
      headers: formData.getHeaders()
    });

    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data.availability).toBe(true);
  });
});

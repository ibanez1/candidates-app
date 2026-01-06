export interface Candidate {
  id: number;
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  years: number;
  availability: boolean;
}

export interface CandidateInfo {
  id: number;
  name: string;
  surname: string;
  excel: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
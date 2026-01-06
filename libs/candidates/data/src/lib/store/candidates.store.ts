
import { createFeature, createReducer, on, createAction, props } from '@ngrx/store';
import { Candidate, CandidateInfo } from '@org/models';

// Seed data
export const initialCandidates: Candidate[] = [
    { id: 1, name: 'John', surname: 'Doe', seniority: 'junior', years: 1, availability: true },
    { id: 2, name: 'Jane', surname: 'Smith', seniority: 'junior', years: 3, availability: false },
    { id: 3, name: 'Alice', surname: 'Johnson', seniority: 'senior', years: 7, availability: true },
    { id: 4, name: 'Bob', surname: 'Williams', seniority: 'junior', years: 2, availability: false },
    { id: 5, name: 'Charlie', surname: 'Brown', seniority: 'junior', years: 4, availability: true },
    { id: 6, name: 'Diana', surname: 'Evans', seniority: 'senior', years: 10, availability: true },
    { id: 7, name: 'Eve', surname: 'Miller', seniority: 'junior', years: 1, availability: false },
    { id: 8, name: 'Frank', surname: 'Moore', seniority: 'senior', years: 5, availability: true },
    { id: 9, name: 'Grace', surname: 'Taylor', seniority: 'senior', years: 8, availability: false },
    { id: 10, name: 'Hank', surname: 'Anderson', seniority: 'junior', years: 2, availability: true },
    { id: 11, name: 'Ivy', surname: 'Thomas', seniority: 'senior', years: 6, availability: true },
    { id: 12, name: 'Jack', surname: 'Jackson', seniority: 'senior', years: 12, availability: false },
    { id: 13, name: 'Karen', surname: 'White', seniority: 'junior', years: 1, availability: true },
    { id: 14, name: 'Leo', surname: 'Harris', seniority: 'senior', years: 4, availability: false }
];

export interface CandidatesState {
  candidates: Candidate[];
}

export const initialState: CandidatesState = {
  candidates: initialCandidates,
};

export const loadCandidates = createAction('[Candidates] Load Candidates');
export const setCandidates = createAction('[Candidates] Set Candidates', props<{ candidates: Candidate[] }>());
export const createCandidate = createAction('[Candidates] Create Candidate', props<{ candidate: Candidate }>());
export const deleteCandidate = createAction('[Candidates] Delete Candidate', props<{ id: number }>());


function sessionStorageMetaReducer(reducer: any): any {
  return function (state: any, action: any) {
    let nextState = state;
    if (state === undefined && typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('candidatesState');
      if (stored) {
        try {
          nextState = JSON.parse(stored);
        } catch (e) {
          nextState = undefined;
          return e;
        }
      }
    }
    const newState = reducer(nextState, action);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('candidatesState', JSON.stringify(newState));
    }
    return newState;
  };
}


const candidatesReducer = sessionStorageMetaReducer(
  createReducer(
    initialState,
    on(setCandidates, (state, { candidates }) => ({ ...state, candidates })),
    on(createCandidate, (state, { candidate }) => ({
      ...state,
      candidates: [candidate, ...state.candidates]
    })),
    on(deleteCandidate, (state, { id }) => ({
      ...state,
      candidates: state.candidates.filter(c => c.id !== id)
    }))
  )
);

export const candidatesFeature = createFeature<
  'candidates',
  CandidatesState
>({
  name: 'candidates',
  reducer: candidatesReducer
});

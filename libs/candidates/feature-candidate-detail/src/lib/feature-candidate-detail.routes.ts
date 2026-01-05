import { Routes } from '@angular/router';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';

export const featureCandidateDetailRoutes: Routes = [
  {
    path: ':id',
    component: CandidateDetailComponent,
  },
];
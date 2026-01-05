import { Routes } from '@angular/router';
import { CandidateListComponent } from './candidates-list/candidates-list.component';

export const featureCandidatesRoutes: Routes = [
  {
    path: '',
    component: CandidateListComponent,
  },
];
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'candidates',
    pathMatch: 'full',
  },
  {
    path: 'candidates',
    loadChildren: () =>
      import('@org/candidates/feature-candidates').then(m => m.featureCandidatesRoutes),
  },
  {
    path: 'candidates',
    loadChildren: () =>
      import('@org/candidates/feature-candidate-detail').then(
        m => m.featureCandidateDetailRoutes
      ),
  },
  {
    path: '**',
    redirectTo: 'candidates',
  },
];

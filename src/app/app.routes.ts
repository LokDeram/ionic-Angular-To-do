import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'mes-taches',
        loadComponent: () =>
          import('./pages/mes-taches/mes-taches.page').then((m) => m.MesTachesPage),
      },
      {
        path: 'autres',
        loadComponent: () =>
          import('./pages/autres/autres.page').then((m) => m.AutresPage),
      },
      {
        path: 'archivees',
        loadComponent: () =>
          import('./pages/archivees/archivees.page').then((m) => m.ArchiveesPage),
      },
      {
        path: 'tache-form', // ✅ maintenant dans tabs
        loadComponent: () =>
          import('./pages/tache-form/tache-form.page').then((m) => m.TacheFormPage),
      },
      {
        path: '',
        redirectTo: 'mes-taches',
        pathMatch: 'full',
      },
    ],
  },
];

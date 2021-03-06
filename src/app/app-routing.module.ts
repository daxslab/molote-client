import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'map', loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)},
  {
    path: 'advanced-report',
    loadChildren: () => import('./advanced-report/advanced-report.module').then( m => m.AdvancedReportPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

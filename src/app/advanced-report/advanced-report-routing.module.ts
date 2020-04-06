import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancedReportPage } from './advanced-report.page';

const routes: Routes = [
  {
    path: '',
    component: AdvancedReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedReportPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancedReportPageRoutingModule } from './advanced-report-routing.module';

import { AdvancedReportPage } from './advanced-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvancedReportPageRoutingModule
  ],
  declarations: [AdvancedReportPage]
})
export class AdvancedReportPageModule {}

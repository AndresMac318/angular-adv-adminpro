import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    Grafica1Component,
    ProgressComponent,
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    Grafica1Component,
    ProgressComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
  
})
export class PagesModule { }

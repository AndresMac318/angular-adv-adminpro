import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonutComponent } from './donut/donut.component';


@NgModule({
  declarations: [
    IncrementadorComponent,
    DonutComponent
  ],
  exports: [
    IncrementadorComponent,
    DonutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ]
})
export class ComponentsModule { }

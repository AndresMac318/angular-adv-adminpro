import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from "../shared/shared.module";
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    Grafica1Component,
    ProgressComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    PerfilComponent,
    UsuariosComponent,
  ],
  exports: [
    ReactiveFormsModule,
    PagesComponent,
    DashboardComponent,
    Grafica1Component,
    ProgressComponent,
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ComponentsModule
  ]
  
})
export class PagesModule { }

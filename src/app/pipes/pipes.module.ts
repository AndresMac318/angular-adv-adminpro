import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [ ImagenPipe ],
  /* imports: [
    CommonModule,   ***** No se usara ngif, ngfor, otras directivas
  ], */
  exports: [
    ImagenPipe
  ]
})
export class PipesModule { }

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {
  
  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  /*
  ?Renombrar el atributo
  @Input('valor') progreso: number = 50; */

  /* 
  ?Renombrar el evento como lo recibira el padre
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter;*/

  // * Este componente podra recibir propiedad dsd su padre llamada valor
  @Input('valor') progreso: number = 50;
  
  // * podra recibir una clase para condicionar los colores de cada incrementador
  @Input() btnClass: string = 'btn-primary';
  
  // * Emitira valores al padre
  @Output() valorSalida: EventEmitter<number> = new EventEmitter;


  cambiarValor(valor: number) {

    if(this.progreso >= 100 && valor > 0){
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }

    if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      return this.progreso = 0;
    }

    this.valorSalida.emit(this.progreso + valor)
    return this.progreso += valor;
    /* return this.progreso += valor; */
  
  }

  onChange(nuevoValor:number){

    if(nuevoValor >= 100){
      this.progreso = 100;
    }else if(nuevoValor <= 0 || nuevoValor == null){
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit(this.progreso);    
  }

}

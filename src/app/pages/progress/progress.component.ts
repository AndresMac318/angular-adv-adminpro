import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [
    './progress.component.css'
  ]
})
export class ProgressComponent{

  progreso1: number = 25;
  progreso2: number = 35;

  get getProgreso1(){
    return `${this.progreso1}%`
  }
  
  get getProgreso2(){
    return `${this.progreso2}%`
  }

  /* 
  ?se puede ejecutar una fn cada vez que el evento se dispare
  cambioValorHijo(valor: number){
    console.log('se cambio el valor en el hijo', valor);
    this.progreso1=valor;
  } */

}
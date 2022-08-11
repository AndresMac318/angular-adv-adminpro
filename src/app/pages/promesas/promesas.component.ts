import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    this.getUsuarios()
      .then()

    /* 
    //* Peticion http GET a API publica
    fetch('https://restcountries.com/v2/name/peru')
      .then(resultado => resultado.json())
      .then(json => console.log(json))
      .catch(err=>console.log(err)); 
    */
    
    /* 
    ? Funcionamiento de una promesa
    const promesa = new Promise( ( resolve, reject ) => {
      if(false){
        resolve('Hola mundo')
      }else{
        reject('Algo salio mal')
      }
    });

    promesa.then( mensaje => {
      console.log(mensaje);
    })
    .catch( error => console.log('Error en la promesa', error ));

    console.log('Fin del ngOnInit'); */

  }
  
  getUsuarios(){
    return new Promise((resolve)=>{
      fetch('https://reqres.in/api/users?page=1')
        .then(res => res.json())
        .then(body => resolve(body.data))
    });
    //return promesa;
  }

}

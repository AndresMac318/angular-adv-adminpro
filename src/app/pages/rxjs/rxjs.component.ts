import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public internalSubs!: Subscription;

  constructor() { 
    
    /* // ? me subscribo a el observer para que empiece a ponerse a trabajar 
    this.retornaObservable().pipe( // *pipe: forma para intentar transformar la info q fluye por el observable o reintentar hacer
      retry(2)
    ).subscribe(
      valor => console.log('subs', valor), 
      error => console.warn('Error', error), //* funcion de error
      () => console.info('obs terminado!') //*funcion cuando se completa
    ) */

    this.internalSubs = this.retornaIntervalo().subscribe(console.log);

  }
  ngOnDestroy(): void {
    this.internalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{
    /* 
    *interval: Crea un observable q emite valores numericos cada que se cumpla un intervalo
    *estipulado
    */
    return interval(100)
             .pipe(
               //take(10),//*dice cuantas emisiones del observable se necesitan, automaticamente completa el obs
               map(valor=>{//* map recibe el arg q el obs padre "interval" emita y la transforma por cada vez q 
               return valor + 1;
               //map(valor => valor + 1)
              }),
              filter(valor => (valor % 2 === 0) ? true : false),//*si es par pasara sino no pasara
             ); 
    
  } 

  // ? funcion que retorna un observable
  retornaObservable():Observable<number>{
    let i = -1;

    /*
    * observer es quien estara emitiendo los valores,cuando se termina, cuando da error
    ?subscriber dira como esta el observable y q info estara fluyendo a traves de él
    */
    return new Observable<number>(observer => {

    const intervalo = setInterval(() => {
      i++;
      observer.next(i); //sgte valor q emitira el observer

      if (i === 4) {
        clearInterval(intervalo);
        observer.complete();
      }
      if (i === 2) {        
        observer.error('y llego al valor de 2')
      }

    }, 1000)
    });

  }

}

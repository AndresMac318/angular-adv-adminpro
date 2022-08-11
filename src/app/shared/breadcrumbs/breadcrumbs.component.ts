import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  tituloSubs$!:Subscription;

  public titulo!: string;

  constructor(private router: Router) {
    this.tituloSubs$ = this.getArgumentosRuta()
                              .subscribe(({titulo}) =>{
                                this.titulo = titulo;
                                document.title = `AdminPro - ${titulo}`;
                              })
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta(){
    //*events contiene eventos referentes a las rutas de angular
    return this.router.events.pipe(
      filter((event:any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data),
    )
    
  }



}

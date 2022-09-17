import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, 
              private router: Router) {

  }

  canActivate(
    
    route: ActivatedRouteSnapshot,
    
    state: RouterStateSnapshot) {

      /* this.usuarioService.validarToken().subscribe( resp => {
        console.log(resp);
        
      })

      console.log('Paso por canActivated'); */
      
      return this.usuarioService.validarToken().pipe(
        tap( estaAutenticado => { //*dispara efecto 2dario
          if(!estaAutenticado){ //*se disparara este efecto 2rio solo si NO esta autenticado
            this.router.navigateByUrl('/login');
          }
        })
      )
    }
  
}

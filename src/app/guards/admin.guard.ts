import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private usuarioSvc: UsuarioService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // console.log('admin guard');
      
      if ( this.usuarioSvc.role === 'ADMIN_ROLE' ) {
        return true;
      } else {
        this.router.navigateByUrl('/dashboard');
        return false;
      }

      // return (this.usuarioSvc.role === 'ADMIN_ROLE') ? true : false;
  }
  
}

import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

//se declara aqui afuera para no tener que usar this.blabla
const base_url = environment.base_url;

//* para usar el objeto global de google que esta en el index.html
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //public auth2:any;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone
  ) {
  }

  // todo: copiar googleInit()


  // todo fin copiar googleInit()

  logout() {
    localStorage.removeItem('token');
    
    google.accounts.id.revoke('andres98belt@gmail.com', () => {
      //* se utiliza ngzone para usar fragmentos de codigo que se ejecutaban por fuera de angular "redireccion" con fn ajenas a angular
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      });
    })
  }

  //* fn que valida si existe un token de sesion 
  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    // ?peticion que renueva el token de sesion
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => { //respuesta del backend con el token 
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true ),//* se transforma la respuesta
      //? catchError permite atrapar el error si lo hay
      catchError( err => of(false) ) //! of : permite crear un observable con base al argumento que se le pase, esto para no romper el ciclo
    );

  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
    .pipe(
      tap((res:any) => {//? tap recibira la respuesta 100pre regresara un observable, no se modificara el login component
        console.log(res);
        //se grabara el token en localstorage si el login es correcto
        localStorage.setItem('token', res.token)
      })
    );
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap((res:any)=>{//? tap recibira la respuesta 100pre regresara un observable, no se modificara el login component
        console.log(res);
        //se grabara el token si el login es correcto
        localStorage.setItem('token', res.token)
      })
    );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe( //tap permite disparar un efecto secundario
        tap((res:any)=>{//? tap recibira la respuesta 100pre regresara un observable, no se modificara el login component
          //console.log(res);
          //se grabara el token si el login es correcto
          localStorage.setItem('token', res.token);
        })
      )
  }

}

import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, of, delay } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import Swal from 'sweetalert2';

//se declara aqui afuera para no tener que usar this.blabla
const base_url = environment.base_url;

//* para usar el objeto global de google que esta en el index.html
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //public auth2:any;

  //propiedad creada para almacenar la info del usuario que se logguea
  public usuario!: Usuario;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.usuario.uid || '';
  }
  
  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  grabarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);

    //se graba el menu en localstorage
    localStorage.setItem('menu', JSON.stringify( menu ));
  }

  // todo: copiar googleInit()
  googleInit(){
    // * inicializa google auth
    google.accounts.id.initialize({
      client_id: "86908553504-6quiecha7rrhaglga2mvdk6atk5l6i25.apps.googleusercontent.com",
      //callback: this.handleCredentialResponse
      callback: (response: any) => {
        //console.log(response);
        this.handleCredentialResponse(response);
      },
    })
  }

  handleCredentialResponse(response: any){
    //console.log("Encoded JWT ID token: " + response.credential);
    this.loginGoogle(response.credential) //* envia token generado por google
      .subscribe(resp => {

        //* uso de ngZone
        this.ngZone.run(() => {
          //Navegar al Dashboard
          this.router.navigateByUrl('/');
        });
        
      })
  }

  // todo fin copiar googleInit()

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    
    //TODO: borrar menu

    google.accounts.id.revoke('andres98belt@gmail.com', () => {
      //* se utiliza ngzone para usar fragmentos de codigo que se ejecutaban por fuera de angular "redireccion" con fn ajenas a angular
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      });
    })
  }

  //* fn que valida si existe un token de sesion y retorna true o false dependiendo el caso  | se usa en el Auth guard
  validarToken(): Observable<boolean> {
    
    // ?peticion que renueva el token de sesion
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      //  map( resp => true ),  // se transforma la respuesta a trues
      map( (resp: any) => { //respuesta del backend con el token 
        // se obtiene toda la informacion del usuario y se almacena en la variable del servicio usuario
        //console.log(resp);
        let { email, google, nombre, img='', role, uid } = resp.usuario;
        // * Al usar new se crea una nueva instancia y se almacena en el servicio, ademas se pueden usar los metodos de la instancia
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid );  // img = ''  para evitar errores de que no se encuentra la imagen al validar su extension
         // uso de metodo del modelo: this.usuario.imprimirInformacion();
        
        this.grabarLocalStorage(resp.token, resp.menu);

        return true;
      }),

      //? catchError permite atrapar el error si lo hay
      //! of : permite crear un observable con base al argumento que se le pase en este caso boolean, esto para no romper el ciclo
      catchError( err => of(false))
      
      /* 
      ? se optimizo la sentencia anterior la cual era:
      *tap((res:any)=>{ ... }),
      *map(res=>true)
      ?debido a que en casos particulares se podia llegar a ejectutar primero la validacion antes 
      ?de que se desestructurara el objeto
      */


      /* 
      *Este fragmento permite mostrar en consola err del catchError
      catchError( err => {
        console.log(err);
        return of(false);
      }) 
      */

    );

  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
    .pipe(
      tap((res:any) => {//? tap recibira la respuesta 100pre regresara un observable, no se modificara el login component
        console.log(res);
        //se grabara el token en localstorage si el login es correcto
        this.grabarLocalStorage(res.token, res.menu);
      })
    );
  }

  actualizarPerfil(data: {nombre: string, email: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role || ''
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers);
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      //* tap: adiciona un efecto 2rio, agrega un paso mas, recibira la respuesta del observable.
      tap((res:any)=>{//? tap recibira la respuesta 100pre regresara un observable, no se modificara el login component
        //console.log(res);
        //se grabara el token si el login es correcto, el correo ya existe
        this.grabarLocalStorage(res.token, res.menu);
      })
    );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe( //tap permite disparar un efecto secundario
        tap((res:any)=>{//? tap recibira la respuesta 100pre regresara un observable, no se modificara el login component
          //console.log(res);
          //se grabara el token si el login es correcto
          this.grabarLocalStorage(res.token, res.menu);
        })
      )
  }

  cargarUsuarios(desde:number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        //delay(5000), //si se usa delay se puede simular una carga lenta de la data
        map(resp => {
          //recibe la respuesta que retorna el backend de tipo CargarUsuario
          const usuarios = resp.usuarios.map( //map permite transformar el arreglo y regresar uno diferente
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid) // xq si se encierra entre {} se quiebra la app 
          );
          return { //se retorna la misma resp para no romper la app resp de tipo CargarUsuario
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario){
    const url = `${base_url}/usuarios/${ usuario.uid }`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario){

    /* validacion para no cambiar el rol
    data = {
      ...data,
      role: this.usuario.role || ''
    } */
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }

}

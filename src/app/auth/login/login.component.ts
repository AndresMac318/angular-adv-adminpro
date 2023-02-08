import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

// * google no existe en el componente y se va a importar de manera global
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements AfterViewInit {

  //* se crea la propiedad para recibir la referencia del boton de google del html
  @ViewChild('googleBtn') googleBtn!: ElementRef;


  //* bandera formulario posteado
  public formSubmitted = false;

  public loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private uservice: UsuarioService,
    private ngZone: NgZone
  ) {
    this.crearForm();
    
    /* if (localStorage.getItem('email')) {
      this.loginForm.controls['email'].setValue(localStorage.getItem('email'));
    } */
  }

  // ? una vez el componente esta inicializado lifecicle
  ngAfterViewInit(): void {
    this.startGoogleInit();
  }

  // ? construccion del boton de google
  startGoogleInit(){
    //console.log({esto: this}); el valor de this apunta al componente, pero puede cambiar dependiendo el contexto de this metodo "esto sobre todo en clases typescr..."
    /* google.accounts.id.initialize({
      client_id: "86908553504-6quiecha7rrhaglga2mvdk6atk5l6i25.apps.googleusercontent.com",
      //callback: this.handleCredentialResponse
      callback: (response: any) => {
        console.log(response);
        this.handleCredentialResponse(response);
      }
    }); */
    
    this.uservice.googleInit();

    google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,  //hace la referencia local del boton
      //{ type: "standard" , theme: "filled_blue, outline", size: "large, medium, small", shape: circle, rectangular, pill, square }  // customization attributes
      { type: "standard", theme: "outline", size: "large", shape: "circle" }  // customization attributes
    );
  }

  /* handleCredentialResponse(response: any){
    //console.log("Encoded JWT ID token: " + response.credential);
    this.uservice.loginGoogle(response.credential) //* envia token generado por google
      .subscribe(resp => {

        //* uso de ngZone
        this.ngZone.run(() => {
          //Navegar al Dashboard
          this.router.navigateByUrl('/');
        });
        
      })
  } */

  crearForm(){
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    })
  }

  login(){
    //* realiza posteo
    this.uservice.login(this.loginForm.value).subscribe(res => {
      //console.log(res);
      if (this.loginForm.get('remember')?.value) {
        localStorage.setItem('email', this.loginForm.get('email')?.value);
      } else { //no quiere recordar el email
        localStorage.removeItem('email');
      }

      //Navegar al Dashboard
      this.router.navigateByUrl('/');
      
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error.msg,
        footer: 'AdminPro'
      });
    })
    //this.router.navigateByUrl('/');
}

}

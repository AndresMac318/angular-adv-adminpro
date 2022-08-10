import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // ?salto al DOM para referenciar la etiqueta con un id "unico" #theme 
  linkTheme = document.querySelector('#theme');

  constructor() {
    //  *const con valor igual al tema guardado, si no hay toma el valor definido
    const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
    // *se asigna el atributo href al elemento
    this.linkTheme?.setAttribute('href', url);
    // *se guarda en el localstorage el url
    localStorage.setItem('theme', url);
  }

  changeTheme(theme: string){
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme?.setAttribute('href', url);
    // * grabando el tema seleccionado en localStorage
    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    /* 
    ? se seleccionan tds los elementos que tienen la clase selector, se dejo el salto al DOM  
    ? porque solo son 10 elementos, no es recomendable hacerlo con muchos elementos  
    */
    const links = document.querySelectorAll('.selector'); 
    
    // * se barren los elementos y si borra la clase working
    links.forEach( elemento => {
      // ? este metodo permite remover una clase css
      elemento.classList.remove('working');
      // ? getAttribute permite seleccionar un atributo personalizado
      const btnTheme = elemento.getAttribute('data-theme');
      // ? se construye el url completo que deberia tener el elemento html
      const btnThemeURL = `./assets/css/colors/${btnTheme}.css`;
      // ? se selecciona el url del elemento html para comparar con el del boton
      const currentTheme = this.linkTheme?.getAttribute('href');
      // * Se comparan las URLs de los elementos si hacen match se aplica la clase working del check
      if (btnThemeURL === currentTheme) {
        elemento.classList.add('working');
      }
    })
  }

}

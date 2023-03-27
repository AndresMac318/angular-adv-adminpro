import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  //para que cualquier componente no pueda cambiar la propiedad
  //el modal siempre estara oculto
  private _ocultarModal: boolean = true;

  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id!: string;
  public img!: string;

  //* notificarle al componente el cambio de la img
  public nuevaImg: EventEmitter<string> = new EventEmitter<string>();

  //obtener propiedad de forma segura
  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }`;
    }
    // this.img = img;
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}

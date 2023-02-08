import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario!: Usuario;

  constructor(private usuarioService: UsuarioService) {
    //* como se esta dentro del constructuro no hace falta el this en usuarioService
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }

}

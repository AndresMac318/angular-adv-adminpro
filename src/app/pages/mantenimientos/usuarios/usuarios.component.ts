import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  //* desuscribirse del observable
  public imgSubs!: Subscription;

  constructor(
    private usuarioSvc: UsuarioService, 
    private busquedaSvc: BusquedasService,
    private modalImagenSvc: ModalImagenService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    //* cuando se cambie una imagen se escuchara el evento y refresh
    this.modalImagenSvc.nuevaImg
      .pipe( // *se usa delay para dar el tiempo de cargar la nueva imagen al servidor y mostrarla en la tabla
        delay(200)
      )  
      .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios(){
    this.cargando = true;
    this.imgSubs = this.usuarioSvc.cargarUsuarios(this.desde)
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number){
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string){
    //console.log(termino);

    if(termino.length === 0){
      //se evita con los temporales que los resultados queden por la ultima letra que se borro
      this.usuarios = this.usuariosTemp; 
      return; 
    }
    this.busquedaSvc.buscar('usuarios', termino)
          .subscribe(resp => {
            this.usuarios = resp as Usuario[];
          });
  }

  eliminarUsuario(usuario: Usuario){
    if (usuario.uid === this.usuarioSvc.uid) {
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }
    
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if(result.value){
        this.usuarioSvc.eliminarUsuario(usuario).subscribe(resp => {
          this.cargarUsuarios();     
            Swal.fire(
              'Usuario borrado!',
              `${ usuario.nombre } fue eliminado correctamente`,
              'success'
            );   
        });
      }
    });
  }

  cambiarRole(usuario: Usuario){
    this.usuarioSvc.guardarUsuario(usuario).subscribe(resp => {
      console.log(resp);
    })
  }

  abrirModal(usuario: Usuario){
    if(usuario.uid){
      this.modalImagenSvc.abrirModal('usuarios', usuario.uid, usuario.img);
    }
  }

}

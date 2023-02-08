import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  
  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any;

  constructor(
    private fb: FormBuilder, 
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService  
  ) {
    this.usuario = usuarioService.usuario;
    console.log(this.usuario);
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
    
    
  }

  actualizarPerfil() {
    //console.log(this.perfilForm.value);
    this.usuarioService
      .actualizarPerfil(this.perfilForm.value)
      .subscribe( () => {
        //console.log(resp);
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Guardado!','Perfil actualizado', 'success');
        return;
      },(err)=>{
        //console.log(err);
        Swal.fire('Opps!', err.error.msg, 'error');
        return;
      });
  }

  cambiarImagen(file: File){
    //console.log(file);
    this.imagenSubir = file;

    if(!file){ 
      return this.imgTemp = null; 
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
    return;

  }

  subirImagen(){
    if(!this.usuario.uid) return;
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then(img => {
      this.usuario.img = img;
      Swal.fire('Guardado!','Imagen actualizada', 'success');
      return;
    })
    .catch( err =>{
      console.log(err);
      Swal.fire('Opps!', err, 'error');
      return;
    })
  }

}

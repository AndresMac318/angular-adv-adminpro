import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any;
  
  constructor(public modalImagenSvc: ModalImagenService, public fileUploadSvc: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenSvc.cerrarModal();
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
    const id = this.modalImagenSvc.id;
    const tipo = this.modalImagenSvc.tipo;

    this.fileUploadSvc.actualizarFoto(this.imagenSubir, tipo, id)
    .then(img => {
      Swal.fire('Guardado!','Imagen actualizada', 'success');
      this.modalImagenSvc.nuevaImg.emit(img);
      this.cerrarModal();
      return;
    })
    .catch( err =>{
      console.log(err);
      Swal.fire('Opps!', err, 'error');
      return;
    })
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';

import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medicos.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos: Medico[] = [];
  medicosTemp: Medico[] = [];
  cargando: boolean = true;
  imgSubs$!: Subscription;

  constructor(
    private medicoSvc: MedicoService,
    private busquedaSvc: BusquedasService,
    private modalImagenSvc: ModalImagenService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
        //* cuando se cambie una imagen se escuchara el evento y refresh
        this.imgSubs$ = this.modalImagenSvc.nuevaImg
        .pipe( // *se usa delay para dar el tiempo de cargar la nueva imagen al servidor y mostrarla en la tabla
          delay(500)
          )  
          .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs$.unsubscribe();
  }

  buscar(termino: string){
    if (termino.length === 0) {
      this.medicos = this.medicosTemp;
      return;
    }
    
    this.busquedaSvc.buscar('medicos', termino)
      .subscribe(resp => {
        this.medicos = resp as Medico[];
      });
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoSvc.cargarMedicos().subscribe( resp => {
      this.cargando = false;
      this.medicos = resp;
      this.medicosTemp = resp;
    })
  }

  abrirModal(hospital: Medico){
    if(hospital._id){
      this.modalImagenSvc.abrirModal('medicos', hospital._id, hospital.img);
    }
  }

  borrarMedico(medico: Medico){

    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if(result.value){
        this.medicoSvc.eliminarMedico(medico._id!).subscribe(resp => {
          this.cargarMedicos();     
            Swal.fire(
              'Médico borrado!',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            );  
        });
      }
    });
    
  }
  

  

}

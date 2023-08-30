import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  hospitales: Hospital[] = [];
  hospitalesTemp: Hospital[] = [];
  cargando: boolean = true;

  //* desuscribirse del observable
  public imgSubs$!: Subscription;

  constructor(
    private hospitalSvc: HospitalService, 
    private modalImagenSvc: ModalImagenService,
    private busquedaSvc: BusquedasService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    //* cuando se cambie una imagen se escuchara el evento y refresh
    this.imgSubs$ = this.modalImagenSvc.nuevaImg
      .pipe( // *se usa delay para dar el tiempo de cargar la nueva imagen al servidor y mostrarla en la tabla
        delay(200)
        )  
        .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs$.unsubscribe();
  }

  buscar(termino: string){
    if (termino.length === 0) {
      this.hospitales = this.hospitalesTemp;
      return;
    }
    
    this.busquedaSvc.buscar('hospitales', termino)
      .subscribe(resp => {
        this.hospitales = resp as Hospital[];
      });
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalSvc.cargarHospitales().subscribe(hospitales => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    });
  }

  guardarCambios(hospital: Hospital){
    this.hospitalSvc.actualizarHospital(hospital._id!, hospital.nombre).subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalSvc.eliminarHospital(hospital._id!).subscribe(resp => {
      Swal.fire('Ok!', `${hospital.nombre} eliminado`, 'success');
      this.cargarHospitales();
    })
  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: 'text',
      inputLabel: 'Nombre del hospital',
      inputPlaceholder: 'Ingrese el nombre del hospital',
      showCancelButton: true,
    });

    if(value?.trim().length! > 0){
      this.hospitalSvc.crearHospital(value!).subscribe((resp: any)=>{
        // console.log(resp);
        // this.cargarHospitales();
        this.hospitales.push(resp.hospital);
      });
    }
  }

  abrirModal(hospital: Hospital){
    if(hospital._id){
      this.modalImagenSvc.abrirModal('hospitales', hospital._id, hospital.img);
    }
  }




}

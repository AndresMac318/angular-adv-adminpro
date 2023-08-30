import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private hospitalSvc: HospitalService,
    private medicoSvc: MedicoService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.createForm();
    this.cargarHospitales();
    // valueChanges observable que emite el valor del control cada vez que este se modifique
    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
      });
  }

  cargarMedico(id: string){

    if(id === 'nuevo'){
      return;
    }

    this.medicoSvc.cargarMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe((medico:any) => {
        if(!medico){
          return this.router.navigateByUrl(`/dashboard/medicos/`);
        }
        
        const {nombre, hospital:{_id}} = medico;
        this.medicoSeleccionado = medico;
        return this.medicoForm.setValue({nombre, hospital:_id});
      });
  }

  createForm(){
    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      hospital: ['', [Validators.required]]
    })
  }

  cargarHospitales(){
    this.hospitalSvc.cargarHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
    })
  }

  guardarForm(){

    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoSvc.actualizarMedico(data).subscribe((resp:any) => {
        Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
      })
    } else {
      const { nombre } = this.medicoForm.value;
      this.medicoSvc.crearMedico(this.medicoForm.value)
      .subscribe((resp:any)=> {
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      });
    }
    
  }

  

}

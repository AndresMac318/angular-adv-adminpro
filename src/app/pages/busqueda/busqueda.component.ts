import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private busquedaSvc: BusquedasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({termino}) => this.busquedaGlobal(termino));
  }

  busquedaGlobal(termino: string){
    this.busquedaSvc.busquedaGlobal(termino).subscribe( (resp: any) => {
      // console.log(resp);
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
    })
  }

  goMedico(id: string){
    console.log('dssdsdf');
    this.router.navigateByUrl(`/dashboard/medico/${id}`);
  }



}
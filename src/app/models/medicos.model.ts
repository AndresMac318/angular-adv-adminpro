import { Hospital } from "./hospital.model";

interface _MedicoUser { //el _ indica que es privado por convencion visual
    _id: string;
    nombre: string;
    img: string;
}

export class Medico {
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _MedicoUser,
        public hospital?: Hospital,
    ){
        
    }
}
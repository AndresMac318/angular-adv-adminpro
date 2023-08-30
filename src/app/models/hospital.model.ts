interface _HospitalUser { //el _ indica que es privado por convencion visual
    _id: string;
    nombre: string;
    foto: string;
}

export class Hospital {
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _HospitalUser,
    ){
        
    }
}
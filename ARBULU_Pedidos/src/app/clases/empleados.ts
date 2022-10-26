export class Empleados {
    nombre: string;
    apellido: string;
    DNI: number;
    CUIL: number;
    foto: string;
    perfil: string;
    uid:string;
    constructor(
        uid:string,
        nombre: string,
        apellido: string,
        DNI: number,
        CUIL: number,
        foto: string,
        perfil: string

    ){
        this.nombre= nombre;
        this.apellido= apellido;
        this.DNI= DNI;
        this.CUIL= CUIL;
        this.foto= foto;
        this.perfil= perfil;
        this.uid= uid;
    }
}

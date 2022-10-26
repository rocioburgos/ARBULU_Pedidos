export class Empleados {
    nombre: string;
    apellido: string;
    DNI: number;
    CUIL: number;
    foto: string;
    perfil: string;
    uid:string;
    
    constructor(){
        this.nombre= '';
        this.apellido= '';
        this.DNI= 0;
        this.CUIL= 0;
        this.foto= '';
        this.perfil= '';
        this.uid= '';
    }
}
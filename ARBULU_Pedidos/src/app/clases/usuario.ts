export class Usuario {
        email: string;
        nombre: string;
        apellido: string;
        DNI: number;
        CUIL: number;
        foto: string;
        perfil: string;
        uid:string;
        tipo:eUsuario;
        tipoEmpleado:eEmpleado;
        
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

export enum eUsuario{
    dueño,
    supervisor,
    empleado,
    cliente,
}

export enum eEmpleado{
    metre,
    mozo,
    cocinero,
    bartender
}
export class Usuario {
        email: string;
        nombre: string;
        apellido: string;
        dni: number;
        cuil: number;
        foto: string;
        uid: string;
        tipo: eUsuario;
        tipoEmpleado: eEmpleado;
        enListaDeEspera: boolean;
        mesa: string;
        clienteValidado: boolean;
        
        constructor(){
            this.nombre= '';
            this.apellido= '';
            this.dni= 0;
            this.cuil= 0;
            this.foto= '';
            this.uid= '';
            this.enListaDeEspera = false;
            this.mesa = '';
            this.clienteValidado = false;
        }
}

export enum eUsuario{
    dueño='dueño',
    supervisor='supervisor',
    empleado='empleado',
    cliente='cliente',
}

export enum eEmpleado{
    metre='metre',
    mozo='mozo',
    cocinero='cocinero',
    bartender='bartender'
}
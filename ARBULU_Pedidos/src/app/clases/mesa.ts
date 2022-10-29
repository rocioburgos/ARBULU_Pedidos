export class Mesa {
    numero:number;
    cantidadComensales:number;
    tipo:string;
    img_src:string;

    constructor(){
        this.numero = 0;
        this.cantidadComensales = 0;
        this.tipo = '';
        this.img_src = '';
    }
}

export enum eTipoMesa{
    VIP,
    discapacitados,
    estandar,
    cumpleaños
}
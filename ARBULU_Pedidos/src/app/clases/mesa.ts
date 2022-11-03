import { timingSafeEqual } from "crypto";

export class Mesa {
    numero:number;
    cantidadComensales:number;
    tipo:string;
    img_src:string;
    ocupada: boolean;
    uid: string;

    constructor(){
        this.numero = 0;
        this.cantidadComensales = 0;
        this.tipo = '';
        this.img_src = '';
        this.ocupada = false;
        this.uid= '';
    }
}

export enum eTipoMesa{
    VIP,
    discapacitados,
    estandar,
    cumpleaños
}
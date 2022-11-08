import { Timestamp } from "@angular/fire/firestore";

 
export class Mensaje {

    remitente:string;//email y nombre de quien mando el mensaje 
    mensaje:string;
    diaHora:string; 
    mesa:string;
    fulldate:Date;
    constructor(remitente:string,   mensaje: string, diaHora:string, mesa:string, date:Date){
        this.remitente= remitente; 
        this.mensaje= mensaje;
        this.diaHora= diaHora;
        this.mesa= mesa;
        this.fulldate= date;
    }
}
 interface producto_pedido{
    uid_producto:string;
    nombre: string; 
    cantidad: number; 
    sector:string;
 }

 export enum eEstadPedido{
    pendiente= 'PENDIENTE',
    en_elaboracion= 'EN_ELABORACION',
    terminado='TERMINADO',
    entregado='ENTREGADO' ,
    recibido='RECIBIDO',
    pagado='PAGADO'   
 }
export class Pedido{
    numero_mesa: number;
    uid_mesa:string;
    total: number;
    tiempo_elaboracion: number; 
    productos: producto_pedido[];
    estado: eEstadPedido; 
}
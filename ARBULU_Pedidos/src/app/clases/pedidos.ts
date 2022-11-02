 
 export enum eEstadPedido{
   PENDIENTE= 'PENDIENTE',
    CONFIRMADO='CONFIRMADO',
    EN_ELABORACION= 'EN_ELABORACION',
    TERMINADO='TERMINADO',
    ENTREGADO='ENTREGADO' ,
    RECIBIDO='RECIBIDO',
    PAGADO='PAGADO'   
 }
 export enum eEstadoProductoPedido{
    PENDIENTE= 'PENDIENTE',
   EN_ELABORACION= 'EN_ELABORACION',
   TERMINADO='TERMINADO'
}

export interface productoPedido{ 
   cantidad:number;
   descripcion: string;
   doc_id:string;
   estadoProductoPedido:eEstadoProductoPedido;
   img_src: string[];
   precio: number;
   nombre: string;
   sector: string; 
   selected:boolean;   
   tiempo_elaboracion: number;  
}

export class Pedido{
    numero_mesa: number;
    uid_mesa:string;
    total: number;
    tiempo_elaboracion: number; 
    productos: productoPedido[];
    estado: eEstadPedido; 
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { eEstadoProductoPedido, eEstadPedido, productoPedido } from '../clases/pedidos';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { MensajeService } from '../servicios/mensaje.service';
import { PedidosService } from '../servicios/pedidos.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { UtilidadesService } from '../servicios/utilidades.service';
import { NotificationService } from '../servicios/notification.service';
@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {

  pedido_id: string = '';
  pedido: any = {
    numero_mesa: 0
  };

  sectorUserActual = '';//
  usuario: any;
  esCliente = false;
  esMetre = false;
  esEmpleado = false;
  pedidoLS: any;
  scanActive = false;
  content_visibility = '';
  scan_visibility = 'hidden';
  satisfaccionPorcent: string;
  usuarios: any;
  constructor(
    private route: ActivatedRoute,
    private pedidoSrv: PedidosService,
    private authSrv: AuthService,
    private userSrv: FirestoreService,
    private msjSrv: MensajeService,
    private utilidadesSrv: UtilidadesService,
    private spinnerSrv: NgxSpinnerService,
    private pushSrv: NotificationService) {
    // this.route.snapshot.paramMap.get('doc_id')
    this.pedido_id = this.route.snapshot.paramMap.get('pedido_id');
  }

  ngOnInit() {

    this.userSrv.obtenerUsuarios().subscribe((res) => {
      this.usuarios = res;
    })

    this.usuario = this.authSrv.getCurrentUserLS();

    if (this.usuario.tipo == 'cliente') {
      this.esCliente = true;
      this.esMetre = false;
      this.esEmpleado = false;
    } else if (this.usuario.tipo == 'empleado') {
      if (this.usuario.tipoEmpleado == 'bartender') {
        this.esEmpleado = true;
        this.esCliente = false;
        this.esMetre = false;
        this.sectorUserActual = 'BEBIDA';
      } else if (this.usuario.tipoEmpleado == 'cocinero') {
        this.esEmpleado = true;
        this.esCliente = false;
        this.esMetre = false;
        this.sectorUserActual = 'COCINA';
      } else {
        this.esMetre = true;
        this.esCliente = false;
        this.esEmpleado = false;
      }
    }

    if (this.esCliente) {

      this.pedidoSrv.TraerPedidoByUserId(this.usuario.uid).subscribe((res) => {
        this.pedido = res[0];
        console.log('PEDIDO SELECCIONADO: ' + this.pedido)
      });
      /* this.pedidoLS= localStorage.getItem('pedido');
        if(this.pedidoLS != null  ){
          this.pedidoLS= JSON.parse(this.pedidoLS); 
          this.pedido =this.pedidoLS;
          this.pedidoSrv.TraerPedido(this.pedido.pedidoID).subscribe((res) => {
            this.pedido = res;
            console.log('PEDIDO SELECCIONADO: ' + this.pedido)
          });
          } */
    } else {
      this.pedidoSrv.TraerPedido(this.pedido_id).subscribe((res) => {
        this.pedido = res;
        console.log('PEDIDO SELECCIONADO: ' + this.pedido)
      });

    }


  }

  confirmarPedido(pedido_sel: any, proxEstado: string) {

    this.pedido.estado = (proxEstado == eEstadPedido.CONFIRMADO) ? eEstadPedido.CONFIRMADO : eEstadPedido.ENTREGADO;
    if (this.pedido.estado == eEstadPedido.CONFIRMADO) {
      this.notificar(pedido_sel)
    }


    this.pedidoSrv.actualizarProductoPedido(this.pedido, this.pedido.doc_id)

  }

  cambiarEstado(item: any, proxEstado: string) {
    let cantProdPedido = this.pedido.productos.length;

    let productosTerminados = 0;
    if (this.pedido.estado == 'CONFIRMADO') {
      this.pedido.estado = eEstadPedido.EN_ELABORACION;
    }

    item.estadoProductoPedido = (proxEstado == eEstadoProductoPedido.EN_ELABORACION) ? eEstadoProductoPedido.EN_ELABORACION : eEstadoProductoPedido.TERMINADO;
    this.pedido.productos.forEach(prod => {
      if (prod.doc_id == item.doc_id) {
        prod = item
      }
    });

    this.pedido.productos.forEach((producto: productoPedido) => {
      if (producto.estadoProductoPedido == eEstadoProductoPedido.TERMINADO) {
        productosTerminados++;

      }
    });

    if (productosTerminados == cantProdPedido) {
      this.pedido.estado = eEstadPedido.TERMINADO;
      console.log('PRODUCTO TERMINADO');

      this.notificarPedidoTerminado(this.pedido)
    }
    console.log('ESTADO  GENERAL DESPUES DE CADA SECTOR:' + this.pedido.estado)
    this.pedidoSrv.actualizarProductoPedido(this.pedido, this.pedido.doc_id)
  }

  confirmarRecepcion(pedidoID: string) {
    console.log('Pedido recibido: ' + pedidoID)
    this.pedido.estado = eEstadPedido.RECIBIDO;
    this.pedidoSrv.actualizarProductoPedido(this.pedido, pedidoID);
  }

  pedirCuenta(pedidoID: string) {
    this.pedido.estado = eEstadPedido.CUENTA;
    this.pedidoSrv.actualizarProductoPedido(this.pedido, pedidoID);
  }
  pagarPedido(pedidoID: string) {
    let descuentoCalcu= (this.pedido.total * this.pedido.descuento)/100;
    this.pedido.estado = eEstadPedido.PAGADO;
    this.pedido.total = this.pedido.total + this.pedido.propina - descuentoCalcu;
    this.pedidoSrv.actualizarProductoPedido(this.pedido, pedidoID);
  }
  confirmarPago(pedidoID: string) {
    this.pedido.estado = eEstadPedido.COBRADO;
    this.pedidoSrv.actualizarProductoPedido(this.pedido, pedidoID).then(() => {
      this.liberarMesa(pedidoID)
    });


  }

  liberarMesa(pedidoID: string) {
    this.spinnerSrv.show();
    this.pedido.estado = eEstadPedido.FINALIZADO;
    //finalizar pedido
    this.pedidoSrv.actualizarProductoPedido(this.pedido, pedidoID);
    //Borrar mensajes
    this.msjSrv.borrarMensajesByMesa(this.pedido.numero_mesa);
    //Liberar mesa
    this.userSrv.ActualizarMesaEstado(this.pedido.uid_mesa, false);
    //liberar usuario

    this.userSrv.ActualizarClienteMesa(this.pedido.uid_usuario, '');

    setTimeout(() => {
      this.spinnerSrv.hide();
    }, 5000);
  }

  manejarPropina() {
    if (this.satisfaccionPorcent == '0%') {
      //sin propina
      this.pedido.nivelSatisfaccion = '0%';
      this.pedido.propina = 0;
    } else if (this.satisfaccionPorcent == '5%') {
      this.pedido.nivelSatisfaccion = '5%';
      this.pedido.propina = this.pedido.total * 0.05;
    } else if (this.satisfaccionPorcent == '10%') {
      this.pedido.nivelSatisfaccion = '10%';
      this.pedido.propina = this.pedido.total * 0.10;
    } else if (this.satisfaccionPorcent == '15%') {
      this.pedido.nivelSatisfaccion = '15%';
      this.pedido.propina = this.pedido.total * 0.15;
    } else if (this.satisfaccionPorcent == '20%') {
      this.pedido.nivelSatisfaccion = '20%';
      this.pedido.propina = this.pedido.total * 0.20;

    } else {
      this.utilidadesSrv.errorToast('Escanee un qr de propina', 6000)
    }


  }


  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (error) {
      this.utilidadesSrv.vibracionError();
      this.utilidadesSrv.mostrartToast('No tiene permisos.')
      console.log(error);
    }
  }

  async startScan() {

    try {
      document.querySelector('body').classList.add('scanner-active');
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      this.scanActive = true;
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      this.scan_visibility = '';
      const result = await BarcodeScanner.startScan();

      this.content_visibility = '';
      this.scan_visibility = 'hidden';
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');

      if (result?.hasContent) {
        this.satisfaccionPorcent = result.content;
        this.manejarPropina();
        document.querySelector('body').classList.remove('scanner-active');
        this.scanActive = false;
      }
    } catch (error) {
      console.log(error);
      this.utilidadesSrv.vibracionError();
      this.utilidadesSrv.mostrartToast('Error al escanear el documento.')
      document.querySelector('body').classList.remove('scanner-active');
      this.stopScan();
    }
  }



  stopScan() {
    setTimeout(() => {
    }, 3000);
    this.content_visibility = '';
    this.scan_visibility = 'hidden';
    this.scanActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }
  


  notificarPedidoTerminado(pedido: any) {
    this.usuarios.forEach(user => {

      if (user.token != '' && user.tipo == 'empleado' && (user.tipoEmpleado == 'metre' || user.tipoEmpleado == 'mozo')) {
 
          this.pushSrv
            .sendPushNotification({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              registration_ids: [
                // eslint-disable-next-line max-len
                user.token
              ],
              notification: {
                title: 'Pedido terminado',
                body: 'Pedido listo para entregar Mesa: '+pedido.numero_mesa,
              },
              data: {
                ruta: 'detalle-pedido',
                pedido_id:pedido.doc_id
              },
            })
            .subscribe((data) => {
              console.log(data);
            });
         
      }
    });

  }

  notificar(pedido: any) {
    this.usuarios.forEach(user => {

      if (user.token != '' && user.tipo == 'empleado' && (user.tipoEmpleado == 'cocinero' || user.tipoEmpleado == 'bartender')) {
        if (this.pedidosDeSuSector(user.tipoEmpleado, pedido)) {

          this.pushSrv
            .sendPushNotification({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              registration_ids: [
                // eslint-disable-next-line max-len
                user.token
              ],
              notification: {
                title: 'Nuevo pedido',
                body: 'Mesa: '+pedido.numero_mesa,
              },
              data: {
                ruta: 'detalle-pedido',
                pedido_id:pedido.doc_id
              },
            })
            .subscribe((data) => {
              console.log(data);
            });
        }
      }
    });

  }

  pedidosDeSuSector(userTipo: string, pedido: any): boolean {
    let sectorUsuario = '';
    if (userTipo == 'cocinero') {
      sectorUsuario = 'COCINA'
    } else if (userTipo == 'bartender') {
      sectorUsuario = 'BEBIDA'
    }

    pedido.productos.forEach(element => {
      if (element.sector == sectorUsuario) {
        return true;
      }
    });
    return false
  }


}

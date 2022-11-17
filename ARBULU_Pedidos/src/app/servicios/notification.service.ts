import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FCM } from '@capacitor-community/fcm'; 
import { FirestoreService } from '../servicios/firestore.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private user;
  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private http: HttpClient , 
    private fireSrv:FirestoreService,
    private router:Router
  ) {
    // const aux = doc(firestore, 'personas/4hjcn6LXY1qVfxBDYub3');
    // docData(aux).subscribe((user) => (this.user = user));
  }

  async inicializar(user:any): Promise<void> {
    this.addListeners();
    // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    
    if (this.platform.is('capacitor') && this.user.token === '') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register(); 
      }
    }
  }

  /*getUser(): void {
    const aux = doc(this.firestore, 'personas/4hjcn6LXY1qVfxBDYub3');
    docData(aux, { idField: 'id' }).subscribe(async (user) => {
      this.user = user;
      this.inicializar();
    });
  }*/

  sendPushNotification(req): Observable<any> {
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

    public RegisterFCM(doc_idUsr:string) {
    // Get FCM token instead the APN one returned by Capacitor
    FCM.getToken()
      .then((r) => {
        console.log(`Token ${r.token}`);
       /* const aux = doc(this.firestore, `usuarios/${doc_idUsr}`);
          updateDoc(aux, {
          token: r.token,
        });*/
        this.fireSrv.actualizarToken(r.token, doc_idUsr)
      })
      .catch((err) => {console.log(err)});

  }


  private async addListeners(): Promise<void> {
    //Ocurre cuando el registro de las push notifications finaliza sin errores
  await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        //Acá deberiamos asociar el token a nuestro usario en nuestra bd
        console.log('Registration token: ', token.value);
        localStorage.setItem("deviceToken", JSON.stringify(token));
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
   await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    //Ocurre cuando el dispositivo recive una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
        if(notificationAction.notification.extra.data.pedido_id!= null){
          this.router.navigate([notificationAction.notification.extra.data.ruta,
             { pedido_id: notificationAction.notification.extra.data.pedido_id }]);
        }
        this.router.navigateByUrl(notificationAction.notification.extra.data.ruta)

        
      }
    );
  }
}

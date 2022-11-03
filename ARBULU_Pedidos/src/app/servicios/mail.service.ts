import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { init } from "@emailjs/browser";
init("yNk1aae1tCqd-g1sk");
@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor() { }

  enviarEmail(userName:string, userEmail:string, message: string){
    let templateParams = {
      to_name: userName,
      message: message,
      mailUsuario: userEmail,
      from_name: "ARBULU Pedidos"
    };

    emailjs.send("service_e9cfn48", "template_fiw6npf", templateParams)
      .then(res =>{
        console.log("Email enviado.", res.status, res.text);
      })
      .catch(error =>{
        console.log("Error al enviar el email.", error);
      });
  }
}

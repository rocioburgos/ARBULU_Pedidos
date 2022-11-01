import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  mensajes:any =[
    {nro_mesa: 1,uid_mesa:'', estadoMesa:true, mensaje:'Hay sal?', time:'31/10/2022 22:30:05:01',
    comensal:true},
    {nro_mesa: 1,uid_mesa:'', estadoMesa:true, mensaje:'Si, ya se la acerco', time:'31/10/2022 22:31:05:01',
    comensal:false},
  ];
  nro_mesa:number=1;
  constructor() { }

  ngOnInit() {
  }

}

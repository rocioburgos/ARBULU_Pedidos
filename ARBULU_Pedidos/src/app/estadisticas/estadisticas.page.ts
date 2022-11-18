import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../servicios/auth.service';
import { FirestoreService } from '../servicios/firestore.service';
import { NotificationService } from '../servicios/notification.service';
import { UtilidadesService } from '../servicios/utilidades.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  @ViewChild('puntajeCanvas') private puntajeCanvas: ElementRef;
  @ViewChild('vecesQueVieneCanvas') private vecesQueVieneCanvas: ElementRef;
  @ViewChild('ordenCanvas') private ordenCanvas: ElementRef;
  @ViewChild('quejasCanvas') private quejasCanvas: ElementRef;
  @ViewChild('propinaCanvas') private propinaCanvas: ElementRef;
  @ViewChild('comensalesCanvas') private comensalesCanvas: ElementRef;

  @ViewChild('comportamientoEmpleadosCanvas') private comportamientoEmpleadosCanvas: ElementRef;
  @ViewChild('faltaCanvas') private faltaCanvas: ElementRef;
  @ViewChild('llegaTardeCanvas') private llegaTardeCanvas: ElementRef;
  @ViewChild('inconvenientesCanvas') private inconvenientesCanvas: ElementRef;

  mostrarCliente:boolean = true;
  mostrarEmpleado:boolean = false;
  barChart: any;
  doughnutChart: any;
  pieChart:any;
  lineChart: any;
  encuestasClientes: any[];
  encuestasEmpleados: any[];
  tipoUsuario:string = 'Cliente';

  constructor(private authSvc:AuthService,
    private utilidadesSvc:UtilidadesService,
    private router:Router,
    private alertController:AlertController,
    private spinner:NgxSpinnerService,
    private fireSrv:FirestoreService,
    private notiSrv:NotificationService) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.spinner.show();
    let sub1 = this.fireSrv.getEncuestasClientes().subscribe((data)=>{
      this.encuestasClientes = data;
      console.log(this.encuestasClientes);
      this.barChartEncuestaPuntaje();
      this.doughnutChartInconvenientes();
      this.barChartEncuestaQuejas();
      this.pieChartOrden();
      this.spinner.hide();
      sub1.unsubscribe();
    })
    Chart.register(...registerables);
  }

  barChartEncuestaPuntaje() {
    let valoresPorPuntaje = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0
    };
    this.encuestasClientes.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.puntaje]++;
    });

    this.barChart = new Chart(this.puntajeCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: '# de votos',
          data: [valoresPorPuntaje[1], valoresPorPuntaje[2], valoresPorPuntaje[3], valoresPorPuntaje[4], valoresPorPuntaje[5], valoresPorPuntaje[6], valoresPorPuntaje[7], valoresPorPuntaje[8], valoresPorPuntaje[9], valoresPorPuntaje[10]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      },
    });
  }

  doughnutChartInconvenientes() {
    let valoresPorPuntaje = {
      ninguno: 0,
      algunos: 0,
      muchos: 0
    };

    this.encuestasClientes.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.inconvenientes]++;
    });


    this.doughnutChart = new Chart(this.inconvenientesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ninguno', 'Algunos', 'Muchos'],
        datasets: [{
          label: '# de votos',
          data: [valoresPorPuntaje['ninguno'], valoresPorPuntaje['algunos'], valoresPorPuntaje['muchos']],
          backgroundColor: [
            'rgb(77, 250, 86)',
            'rgb(250, 247, 77)',
            'rgb(250, 140, 77)',
          ],
          hoverBackgroundColor: [
            'rgb(77, 250, 86, 0.5)',
            'rgb(250, 247, 77, 0.5)',
            'rgb(250, 140, 77, 0.5)',
          ]
        }]
      }
    });
  }

  barChartEncuestaQuejas() {
    let valoresPorPuntaje = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };
    this.encuestasClientes.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.quejas]++;
    });

    this.barChart = new Chart(this.quejasCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Ninguna', 'Lento', 'Hostil', 'Torpe', 'Grosero'],
        datasets: [{
          label: 'Puntaje local',
          data: [valoresPorPuntaje[0], valoresPorPuntaje[1], valoresPorPuntaje[2], valoresPorPuntaje[3], valoresPorPuntaje[4]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      },
    });
  }

  pieChartOrden() {
    let valoresPorPuntaje = {
      true: 0,
      false: 0
    };

    this.encuestasClientes.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.orden]++;
    });


    this.pieChart = new Chart(this.ordenCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Si', 'No'],
        datasets: [{
          label: 'Lugar ordenado',
          data: [valoresPorPuntaje['true'], valoresPorPuntaje['false']],
          backgroundColor: [
            'rgb(77, 250, 86)',
            'rgb(250, 247, 77)',
          ],
          hoverBackgroundColor: [
            'rgb(77, 250, 86, 0.5)',
            'rgb(250, 247, 77, 0.5)',
          ]
        }]
      }
    });
  }

  ionViewWillLeave(){
    this.faltaCanvas
  }















  barChartEncuestaComportamientoEmpleados() {
    let valoresPorPuntaje = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0
    };
    this.encuestasEmpleados.forEach((encuesta: any) => {
      switch(encuesta.comportamiento){
        case 'buena':
          valoresPorPuntaje['10']++;
          break;
        case 'mala':
          valoresPorPuntaje['0']++;
        case 'regular':
          valoresPorPuntaje['5']++;
          break;
      }
    });

    this.barChart = new Chart(this.comportamientoEmpleadosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Puntaje del comportamiento',
          data: [valoresPorPuntaje[1], valoresPorPuntaje[2], valoresPorPuntaje[3], valoresPorPuntaje[4], valoresPorPuntaje[5], valoresPorPuntaje[6], valoresPorPuntaje[7], valoresPorPuntaje[8], valoresPorPuntaje[9], valoresPorPuntaje[10]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  doughnutChartFalta() {
    let valoresPorPuntaje = {
      pocas: 0,
      varias: 0,
      muchas: 0
    };

    this.encuestasEmpleados.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.falta]++;
    });

    this.doughnutChart = new Chart(this.faltaCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pocas', 'Varias', 'Muchas'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['pocas'], valoresPorPuntaje['varias'], valoresPorPuntaje['muchas']],
          backgroundColor: [
            'rgb(46, 231, 108)',
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)'
          ],
          hoverBackgroundColor: [
            'rgb(46, 231, 108, 0.5)',
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)'
          ]
        }]
      }
    });
  }

  doughnutChartVecesQueViene() {
    let valoresPorPuntaje = {
      pocas: 0,
      varias: 0,
      muchas: 0
    };

    this.encuestasClientes.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.vecesQueViene]++;
    });

    this.doughnutChart = new Chart(this.vecesQueVieneCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pocas', 'Varias', 'Muchas'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['pocas'], valoresPorPuntaje['varias'], valoresPorPuntaje['muchas']],
          backgroundColor: [
            'rgb(46, 231, 108)',
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)'
          ],
          hoverBackgroundColor: [
            'rgb(46, 231, 108, 0.5)',
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)'
          ]
        }]
      }
    });
  }

  doughnutChartPropina() {
    let valoresPorPuntaje = {
      si: 0,
      no: 0
    };

    this.encuestasClientes.forEach((encuesta: any) => {
      if (encuesta.propina) {
        valoresPorPuntaje['si']++;
      }
      else {
        valoresPorPuntaje['no']++;
      }
    });

    this.doughnutChart = new Chart(this.propinaCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sí', 'No'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['si'], valoresPorPuntaje['no']],
          backgroundColor: [
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)'
          ],
          hoverBackgroundColor: [
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)'
          ]
        }]
      }
    });
  }

  doughnutChartLlegaTarde() {
    let valoresPorPuntaje = {
      si: 0,
      no: 0
    };

    this.encuestasEmpleados.forEach((encuesta: any) => {
      if (encuesta.llegaTarde) {
        valoresPorPuntaje['si']++;
      }
      else {
        valoresPorPuntaje['no']++;
      }
    });

    this.doughnutChart = new Chart(this.llegaTardeCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sí', 'No'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['si'], valoresPorPuntaje['no']],
          backgroundColor: [
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)'
          ],
          hoverBackgroundColor: [
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)'
          ]
        }]
      }
    });
  }

  doughnutChartComensales() {
    let valoresPorPuntaje = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    this.encuestasClientes.forEach((encuesta: any) => {
      valoresPorPuntaje[encuesta.comensales]++;
    });

    this.doughnutChart = new Chart(this.comensalesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ninguno', '1', '2', '3', 'Más de 3'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje[0], valoresPorPuntaje[1], valoresPorPuntaje[2], valoresPorPuntaje[3], valoresPorPuntaje[4]],
          backgroundColor: [
            'rgb(77, 250, 86)',
            'rgb(250, 247, 77)',
            'rgb(250, 140, 77)',
            'rgb(250, 112, 77)',
            'rgb(250, 77, 77)'
          ],
          hoverBackgroundColor: [
            'rgb(77, 250, 86, 0.5)',
            'rgb(250, 247, 77, 0.5)',
            'rgb(250, 140, 77, 0.5)',
            'rgb(250, 112, 77, 0.5)',
            'rgb(250, 77, 77, 0.5)'
          ]
        }]
      }
    });
  }

  async cerrarSesion(){
    const alert = await this.alertController.create({
      header: '¿Seguro que quiere cerrar sesión?',
      cssClass: 'alertSesion',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
          
            this.spinner.show(); 
            this.utilidadesSvc.warningToast("Cerrando sesion.",2000);
             this.fireSrv.actualizarToken( '', this.authSvc.usuarioActual.uid).finally(()=>{
              this.authSvc.signOut().then(()=>{ 
                setTimeout(() => {
                 
                  this.spinner.hide();
                  this.router.navigate(['login']); 
                }, 3000);
              });
             });
          },
        },
      ],
    });  
    await alert.present(); 
  }
}

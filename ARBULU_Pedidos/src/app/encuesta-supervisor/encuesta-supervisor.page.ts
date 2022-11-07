import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { eUsuario } from '../clases/usuario';
import { FirestoreService } from '../servicios/firestore.service';
import { UtilidadesService } from '../servicios/utilidades.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-encuesta-supervisor',
  templateUrl: './encuesta-supervisor.page.html',
  styleUrls: ['./encuesta-supervisor.page.scss'],
})
export class EncuestaSupervisorPage implements OnInit {

  spinner:boolean = false;
  form!:FormGroup;
  //foto:FormData = new FormData();
  encuestas:Array<any> = [];
  verEncuestas:boolean = false;

  formEmpleados!:FormGroup;
  encuestasEmpleados:Array<any> = [];
  verEncuestasEmpleados:boolean = false;

  clientesValidos :Array <any> = [];
  empleadosActuales :Array <any> = [];
  // coleccionEmpleados : any;
  // empleados : any;
  // empleadosBD : any;
  // empleadosActuales : any[] = [];

  tipoUsuario:string="";

  constructor(private router:Router, 
    public firestoreSvc:FirestoreService,
    private fb:FormBuilder,
    private db : AngularFirestore,
    private utilSvc: UtilidadesService) 
    {
      let sub = firestoreSvc.obtenerUsuariosPorTipo(eUsuario.cliente);
      
      let subEmpleados = this.firestoreSvc.obtenerUsuariosPorTipo(eUsuario.empleado);


      this.form = this.fb.group({
        'comportamiento':['',Validators.required],
        'vecesQueViene':['',Validators.required],
        'propina':[true],
        'comentario':[''],
        'comensales':['',Validators.required],
      });

      this.formEmpleados = this.fb.group({
        'comportamiento':['',Validators.required],
        'falta':['',Validators.required],
        'llegaTarde':[true],
        'comentario':[''],
        'inconvenientes':['',Validators.required],
      });
      Chart.register(...registerables);
    }

  ngOnInit() 
  {
    this.verEncuestas=false;
    this.verEncuestasEmpleados=false;
  }

  AsignarTipo(tipoUsuario:any){
    console.log("tipousuario "+tipoUsuario);
    console.log(this.tipoUsuario);
  }

  Omitir()
  {
    this.spinner = true;
    this.verEncuestas=false;
    this.verEncuestasEmpleados=false;
    this.form.reset();
    this.formEmpleados.reset();
    setTimeout(() => {
      this.spinner = false;
      this.router.navigateByUrl('homeSupervisor');
    }, 2000);
  }

  EnviarEncuesta()
  {
    this.firestoreSvc.crearEncuestaSupervisor(this.form.value)
    .then(()=>{
      document.getElementById('enviar').setAttribute('disabled', 'disabled');

      this.spinner = true;
      
      setTimeout(() => {
        this.utilSvc.successToast('Se registró la encuesta correctamente.', 2000);
        
        this.verEncuestas = true;
        this.spinner = false;
      }, 2000);

      setTimeout(() => {
        this.MostrarEncuestas();
      }, 4000);
    }).catch(error=>{
      this.utilSvc.errorToast('Ocurrió un error al registrar la encuesta.', 2000);
    });
  }

  EnviarEncuestaEmpleados()
  {
    // this.firestoreSvc.SubirEncuestaEmpleadosDesdeSupervisor(this.formEmpleados.value)
    // .then(()=>{
    //   document.getElementById('enviarFormEmpleado').setAttribute('disabled', 'disabled');

    //   this.spinner = true;//mirar spinner
      
    //   setTimeout(() => {
    //     this.utilSvc.successToast('Se registró la encuesta correctamente.', 2000);
        
    //     this.verEncuestasEmpleados = true;
    //     this.spinner = false;
    //   }, 2000);

    //   setTimeout(() => {
    //     this.MostrarEncuestasEmpleados();
    //   }, 4000);
    // }).catch(error=>{
    //   this.utilSvc.errorToast('Ocurrió un error al registrar la encuesta.', 2000);
    // });
  }
  MostrarEncuestas()
  {
    // let encuestas = this.firestoreSvc.GetColeccion('encuestaClientesDesdeSupervisor').subscribe((data)=>{
    //   console.log(data);
    //   this.encuestas = data;  
    //   this.barChartEncuestaComportamiento();   
    //   this.doughnutChartPropina(); 
    //   this.doughnutChartComensales();
    //   this.doughnutChartVecesQueViene();
    //   encuestas.unsubscribe();
    // });
  }

  MostrarEncuestasEmpleados()
  {
    // let encuestasSub = this.firestoreSvc.GetColeccion('encuestaEmpleadosDesdeSupervisor').subscribe((data)=>{
    //   this.encuestasEmpleados = data;  
    //   this.barChartEncuestaComportamientoEmpleados();   
    //   this.doughnutChartFalta();
    //   this.doughnutChartLlegaTarde(); 
    //   this.doughnutChartInconvenientes();
    //   encuestasSub.unsubscribe();
    // });
  }

  @ViewChild('comportamientoCanvas') private comportamientoCanvas: ElementRef;
  @ViewChild('vecesQueVieneCanvas') private vecesQueVieneCanvas: ElementRef;
  @ViewChild('propinaCanvas') private propinaCanvas: ElementRef;
  @ViewChild('comensalesCanvas') private comensalesCanvas: ElementRef;

  @ViewChild('comportamientoEmpleadosCanvas') private comportamientoEmpleadosCanvas: ElementRef;
  @ViewChild('faltaCanvas') private faltaCanvas: ElementRef;
  @ViewChild('llegaTardeCanvas') private llegaTardeCanvas: ElementRef;
  @ViewChild('inconvenientesCanvas') private inconvenientesCanvas: ElementRef;

  barChart: any;
  doughnutChart: any;
  lineChart: any;

  barChartEncuestaComportamiento() {
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
    this.encuestas.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.comportamiento]++;  
    });

    this.barChart = new Chart(this.comportamientoCanvas.nativeElement, {
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
    this.encuestasEmpleados.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.comportamiento]++;  
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

    this.encuestasEmpleados.forEach( (encuesta:any) => {
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

    this.encuestas.forEach( (encuesta:any) => {
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

    this.encuestas.forEach( (encuesta:any) => {
      if(encuesta.propina)
      {
        valoresPorPuntaje['si']++;
      }
      else{
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

    this.encuestasEmpleados.forEach( (encuesta:any) => {
      if(encuesta.llegaTarde)
      {
        valoresPorPuntaje['si']++;
      }
      else{
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

    this.encuestas.forEach( (encuesta:any) => {
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

  doughnutChartInconvenientes() {
    let valoresPorPuntaje = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    this.encuestasEmpleados.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.inconvenientes]++;
    });

    this.doughnutChart = new Chart(this.inconvenientesCanvas.nativeElement, {
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

}

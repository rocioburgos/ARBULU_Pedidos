import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QrIngresoLocalPage } from './qr-ingreso-local.page';

describe('QrIngresoLocalPage', () => {
  let component: QrIngresoLocalPage;
  let fixture: ComponentFixture<QrIngresoLocalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QrIngresoLocalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QrIngresoLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

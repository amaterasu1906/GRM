import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCierreComponent } from './ticket-cierre.component';

describe('TicketCierreComponent', () => {
  let component: TicketCierreComponent;
  let fixture: ComponentFixture<TicketCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketCierreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateTrip } from './create-trip';

describe('CreateTrip', () => {
  let component: CreateTrip;
  let fixture: ComponentFixture<CreateTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrip],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { countryKey: 'test' } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

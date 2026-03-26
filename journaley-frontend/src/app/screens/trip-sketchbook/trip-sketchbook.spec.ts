import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TripSketchbook } from './trip-sketchbook';

describe('TripSketchbook', () => {
  let component: TripSketchbook;
  let fixture: ComponentFixture<TripSketchbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripSketchbook],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TripSketchbook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

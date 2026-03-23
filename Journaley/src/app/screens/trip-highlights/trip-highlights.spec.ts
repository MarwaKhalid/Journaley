import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHighlights } from './trip-highlights';

describe('TripHighlights', () => {
  let component: TripHighlights;
  let fixture: ComponentFixture<TripHighlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripHighlights],
    }).compileComponents();

    fixture = TestBed.createComponent(TripHighlights);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

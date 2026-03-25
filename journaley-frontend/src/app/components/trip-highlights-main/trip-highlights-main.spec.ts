import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHighlightsMain } from './trip-highlights-main';

describe('TripHighlightsMain', () => {
  let component: TripHighlightsMain;
  let fixture: ComponentFixture<TripHighlightsMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripHighlightsMain],
    }).compileComponents();

    fixture = TestBed.createComponent(TripHighlightsMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

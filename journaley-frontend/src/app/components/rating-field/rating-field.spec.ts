import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingField } from './rating-field';

describe('RatingField', () => {
  let component: RatingField;
  let fixture: ComponentFixture<RatingField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingField],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCountry } from './create-country';

describe('CreateCountry', () => {
  let component: CreateCountry;
  let fixture: ComponentFixture<CreateCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCountry],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCountry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

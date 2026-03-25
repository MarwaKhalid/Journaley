import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCountry } from './edit-country';

describe('EditCountry', () => {
  let component: EditCountry;
  let fixture: ComponentFixture<EditCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCountry],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCountry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EditCountry } from './edit-country';

describe('EditCountry', () => {
  let component: EditCountry;
  let fixture: ComponentFixture<EditCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCountry],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, name: 'Test', slug: 'test', imageUrl: null } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCountry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

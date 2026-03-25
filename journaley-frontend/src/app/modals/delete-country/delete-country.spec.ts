import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCountry } from './delete-country';

describe('DeleteCountry', () => {
  let component: DeleteCountry;
  let fixture: ComponentFixture<DeleteCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCountry],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCountry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

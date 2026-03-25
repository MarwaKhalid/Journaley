import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCity } from './delete-city';

describe('DeleteCity', () => {
  let component: DeleteCity;
  let fixture: ComponentFixture<DeleteCity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCity],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

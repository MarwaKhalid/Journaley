import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionField } from './description-field';

describe('DescriptionField', () => {
  let component: DescriptionField;
  let fixture: ComponentFixture<DescriptionField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionField],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

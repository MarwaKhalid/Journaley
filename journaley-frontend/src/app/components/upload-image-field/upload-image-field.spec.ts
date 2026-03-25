import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageField } from './upload-image-field';

describe('UploadImageField', () => {
  let component: UploadImageField;
  let fixture: ComponentFixture<UploadImageField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadImageField],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadImageField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

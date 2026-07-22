import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureRequest } from './feature-request';

describe('FeatureRequest', () => {
  let component: FeatureRequest;
  let fixture: ComponentFixture<FeatureRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

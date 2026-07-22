import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustCenter } from './trust-center';

describe('TrustCenter', () => {
  let component: TrustCenter;
  let fixture: ComponentFixture<TrustCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustCenter],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

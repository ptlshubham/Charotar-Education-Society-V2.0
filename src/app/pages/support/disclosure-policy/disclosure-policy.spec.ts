import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclosurePolicy } from './disclosure-policy';

describe('DisclosurePolicy', () => {
  let component: DisclosurePolicy;
  let fixture: ComponentFixture<DisclosurePolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclosurePolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(DisclosurePolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

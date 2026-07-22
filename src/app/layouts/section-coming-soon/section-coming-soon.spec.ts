import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionComingSoon } from './section-coming-soon';

describe('SectionComingSoon', () => {
  let component: SectionComingSoon;
  let fixture: ComponentFixture<SectionComingSoon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionComingSoon],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionComingSoon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

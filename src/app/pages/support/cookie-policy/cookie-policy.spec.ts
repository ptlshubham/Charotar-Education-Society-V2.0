import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePolicy } from './cookie-policy';

describe('CookiePolicy', () => {
  let component: CookiePolicy;
  let fixture: ComponentFixture<CookiePolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiePolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(CookiePolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

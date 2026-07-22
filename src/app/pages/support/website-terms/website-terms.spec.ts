import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteTerms } from './website-terms';

describe('WebsiteTerms', () => {
  let component: WebsiteTerms;
  let fixture: ComponentFixture<WebsiteTerms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteTerms],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsiteTerms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

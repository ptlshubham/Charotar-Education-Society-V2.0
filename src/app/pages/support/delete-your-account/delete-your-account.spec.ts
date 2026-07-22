import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteYourAccount } from './delete-your-account';

describe('DeleteYourAccount', () => {
  let component: DeleteYourAccount;
  let fixture: ComponentFixture<DeleteYourAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteYourAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteYourAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

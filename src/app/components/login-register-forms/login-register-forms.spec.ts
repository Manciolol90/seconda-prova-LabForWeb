import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterForms } from './login-register-forms';

describe('LoginRegisterForms', () => {
  let component: LoginRegisterForms;
  let fixture: ComponentFixture<LoginRegisterForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegisterForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegisterForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

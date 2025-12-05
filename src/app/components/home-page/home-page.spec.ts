import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HOmePage } from './home-page';

describe('HOmePage', () => {
  let component: HOmePage;
  let fixture: ComponentFixture<HOmePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HOmePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HOmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsernameComponent } from './modal-username.component';

describe('ModalUsernameComponent', () => {
  let component: ModalUsernameComponent;
  let fixture: ComponentFixture<ModalUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUsernameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

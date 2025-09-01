import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectlanguageComponent } from './selectlanguage.component';

describe('SelectlanguageComponent', () => {
  let component: SelectlanguageComponent;
  let fixture: ComponentFixture<SelectlanguageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectlanguageComponent]
    });
    fixture = TestBed.createComponent(SelectlanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

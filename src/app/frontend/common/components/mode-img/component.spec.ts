import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeImgComponent } from './component';

describe('ModeImgComponent', () => {
  let component: ModeImgComponent;
  let fixture: ComponentFixture<ModeImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeImgComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

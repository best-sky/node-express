import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeilcomeComponent } from './weilcome.component';

describe('WeilcomeComponent', () => {
  let component: WeilcomeComponent;
  let fixture: ComponentFixture<WeilcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeilcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeilcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

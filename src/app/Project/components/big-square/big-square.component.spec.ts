import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigSquareComponent } from './big-square.component';

describe('BigSquareComponent', () => {
  let component: BigSquareComponent;
  let fixture: ComponentFixture<BigSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigSquareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

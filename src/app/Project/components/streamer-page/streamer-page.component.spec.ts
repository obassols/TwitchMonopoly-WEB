import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerPageComponent } from './streamer-page.component';

describe('StreamerPageComponent', () => {
  let component: StreamerPageComponent;
  let fixture: ComponentFixture<StreamerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

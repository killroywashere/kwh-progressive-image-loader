import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressiveImageLoaderComponent } from './progressive-image-loader.component';

describe('ProgressiveImageLoaderComponent', () => {
  let component: ProgressiveImageLoaderComponent;
  let fixture: ComponentFixture<ProgressiveImageLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressiveImageLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressiveImageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

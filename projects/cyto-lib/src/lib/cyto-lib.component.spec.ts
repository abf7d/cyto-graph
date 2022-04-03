import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoLibComponent } from './cyto-lib.component';

describe('CytoLibComponent', () => {
  let component: CytoLibComponent;
  let fixture: ComponentFixture<CytoLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CytoLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

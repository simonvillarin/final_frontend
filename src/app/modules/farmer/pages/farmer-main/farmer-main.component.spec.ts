import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerMainComponent } from './farmer-main.component';

describe('FarmerMainComponent', () => {
  let component: FarmerMainComponent;
  let fixture: ComponentFixture<FarmerMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerMainComponent]
    });
    fixture = TestBed.createComponent(FarmerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

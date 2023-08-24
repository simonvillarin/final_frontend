import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmingTipsComponent } from './farming-tips.component';

describe('FarmingTipsComponent', () => {
  let component: FarmingTipsComponent;
  let fixture: ComponentFixture<FarmingTipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmingTipsComponent]
    });
    fixture = TestBed.createComponent(FarmingTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

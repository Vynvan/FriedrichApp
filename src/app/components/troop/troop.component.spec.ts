import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TroopComponent } from './troop.component';

describe('TroopComponent', () => {
  let component: TroopComponent;
  let fixture: ComponentFixture<TroopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TroopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TroopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

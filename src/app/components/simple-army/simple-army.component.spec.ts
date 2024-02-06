import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleArmyComponent } from './simple-army.component';

describe('ArmyComponent', () => {
  let component: SimpleArmyComponent;
  let fixture: ComponentFixture<SimpleArmyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleArmyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleArmyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

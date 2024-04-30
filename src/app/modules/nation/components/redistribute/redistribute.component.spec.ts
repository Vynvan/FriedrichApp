import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributeComponent } from './redistribute.component';

describe('RedistributeComponent', () => {
  let component: RedistributeComponent;
  let fixture: ComponentFixture<RedistributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedistributeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedistributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

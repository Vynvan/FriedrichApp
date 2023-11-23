import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationSelectComponent } from './nation-select.component';

describe('NationSelectComponent', () => {
  let component: NationSelectComponent;
  let fixture: ComponentFixture<NationSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

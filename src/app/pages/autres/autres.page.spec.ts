import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutresPage } from './autres.page';

describe('AutresPage', () => {
  let component: AutresPage;
  let fixture: ComponentFixture<AutresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

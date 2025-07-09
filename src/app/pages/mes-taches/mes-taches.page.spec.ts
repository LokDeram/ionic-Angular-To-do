import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesTachesPage } from './mes-taches.page';

describe('MesTachesPage', () => {
  let component: MesTachesPage;
  let fixture: ComponentFixture<MesTachesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesTachesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

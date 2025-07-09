import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TacheFormPage } from './tache-form.page';

describe('TacheFormPage', () => {
  let component: TacheFormPage;
  let fixture: ComponentFixture<TacheFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TacheFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchiveesPage } from './archivees.page';

describe('ArchiveesPage', () => {
  let component: ArchiveesPage;
  let fixture: ComponentFixture<ArchiveesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoordinadorPage } from './coordinador.page';

describe('CoordinadorPage', () => {
  let component: CoordinadorPage;
  let fixture: ComponentFixture<CoordinadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

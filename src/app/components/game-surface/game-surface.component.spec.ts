import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSurfaceComponent } from './game-surface.component';

describe('GameSurfaceComponent', () => {
  let component: GameSurfaceComponent;
  let fixture: ComponentFixture<GameSurfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameSurfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

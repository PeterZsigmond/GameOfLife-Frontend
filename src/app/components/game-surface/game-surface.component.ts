import { Component, OnInit } from '@angular/core';
import { GameOfLife } from 'src/app/models/GameOfLife';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-surface',
  templateUrl: './game-surface.component.html',
  styleUrls: ['./game-surface.component.scss']
})
export class GameSurfaceComponent implements OnInit {

  constructor(public gameService: GameService)
  {
    
  }

  ngOnInit(): void
  {
    
  }
}

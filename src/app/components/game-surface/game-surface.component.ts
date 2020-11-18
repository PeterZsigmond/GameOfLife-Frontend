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

  onCellClick(event)
  {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;
    let value = idAttr.nodeValue;

    let x = value.split("-")[2];
    let y = value.split("-")[1];

    this.gameService.setCell(x, y);
  }
}

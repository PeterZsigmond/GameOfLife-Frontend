import { Component, OnInit } from '@angular/core';
import { GameOfLife } from 'src/app/models/GameOfLife';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-controller',
  templateUrl: './game-controller.component.html',
  styleUrls: ['./game-controller.component.scss']
})
export class GameControllerComponent implements OnInit {

  selectedFile = null;
  autoStep: boolean;
  autoStepTimer: any;
  automatedButtonValue: string;
  
  constructor(public gameService: GameService)
  {
    this.autoStep = false;
    this.automatedButtonValue = "Start";
  }

  ngOnInit(): void
  {

  }

  automatedStepping()
  {
    if(this.autoStep)
    {
      clearInterval(this.autoStepTimer);
      this.automatedButtonValue = "Start";
    }
    else
    {
      this.autoStepTimer = setInterval(() => {
        this.onNextStepButtonClick();
      }, 100);
      this.automatedButtonValue = "Stop";
    }

    this.autoStep = !this.autoStep;
  }

  onStepBackButtonClick()
  {
    this.gameService.stepBackOne();
  }

  onNextStepButtonClick()
  {
    this.gameService.subToNextStep();
  }

  onFileSelected(event)
  {
    this.selectedFile = event.target.files[0];
    
    let fr = new FileReader(); 
    fr.onload = () => this.gameService.processLifFile(fr.result);
    fr.readAsText(this.selectedFile);
  }
}

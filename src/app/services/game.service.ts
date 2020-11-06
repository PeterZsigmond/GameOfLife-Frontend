import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { GameOfLife, IGameOfLife } from '../models/GameOfLife';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  errorMessage = "";
  gameOfLife: GameOfLife;
  gameOfLifeArray: Array<GameOfLife>;

  constructor(private http: HttpClient)
  {
    
  }

  stepBackOne(): void
  {
    if(this.gameOfLifeArray.length > 1)
    {
      this.gameOfLifeArray.pop();
      this.gameOfLife = this.gameOfLifeArray[this.gameOfLifeArray.length - 1];
    }
  }

  subToNextStep(): void{
    this.getNextStep(this.gameOfLife)
        .subscribe(data => {
          this.gameOfLife = data;
          this.gameOfLifeArray.push(this.gameOfLife);
        });
  }

  getNextStep(gameOfLife: IGameOfLife): Observable<IGameOfLife> {
    const url = "http://localhost/api/gameoflife";

    return this.http.post<IGameOfLife>(url, gameOfLife, this.httpOptions)
      .pipe(
        catchError(this.handleError<IGameOfLife>("getNextStep Error:"))
      );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  processLifFile(result)
  {
    this.errorMessage = "";

    let lines = this.breakFileIntoStringArray(result);

    let height = 50;
    let width = 50;

    let cursor_x = Math.floor(width / 2);
    let cursor_y = Math.floor(height / 2);

    let version: string;

    for(let i = 0; i < lines.length; i++)
    {
      if(i == 0)
      {
        if(this.fileIsWrongVersion(lines[i]))
          break;
        this.initGameOfLife(height, width);
        version = lines[i].split(" ")[1];
        continue;
      }

      if(version == "1.05")
      {
        if(lines[i].startsWith("#D") || lines[i].startsWith("#N"))
          continue;

        if(lines[i].startsWith("#R"))
        {
          this.errorMessage = "Currently this software only works with #N mode.";
          break;
        }

        if(lines[i].length == 0)
          continue;
          
        if(lines[i].startsWith("#P"))
        {
          let line = lines[i].split(" ");

          cursor_x = Math.floor(width / 2) + (+line[1]);
          cursor_y = Math.floor(height / 2) + (+line[2]);

          continue;
        }
        
        for(let j = 0; j < lines[i].length; j++)
        {
          if(lines[i][j] == "*")
            this.gameOfLife.cells[cursor_y][cursor_x + j] = true;
        }
        
        cursor_y++;
      }
      else if(version == "1.06")
      {
        if(lines[i].length == 0)
          continue;
        
        let x: number = +lines[i].split(" ")[0];
        let y: number = +lines[i].split(" ")[1];

        this.gameOfLife.cells[Math.floor(height / 2) + y][Math.floor(width / 2) + x] = true;
      }
    }
  }

  initGameOfLife(height: number, width: number)
  {
    this.gameOfLife = new GameOfLife();
    this.gameOfLife.height = height;
    this.gameOfLife.width = width;
    this.gameOfLife.cells = new Array(height).fill(false).map(() => new Array(width).fill(false));

    this.gameOfLifeArray = new Array<GameOfLife>();
    this.gameOfLifeArray.push(this.gameOfLife);
  }

  breakFileIntoStringArray(fileStr): string[]
  {
    let lines: string[] = new Array();
    let str = "";

    for(let i = 0; i < fileStr.length; i++)
    {
      if(fileStr[i] != "\n")
        str += fileStr[i];
      else
      {
        lines.push(str);
        str = "";
      }
    }

    lines.push(str);

    return lines;
  }

  fileIsWrongVersion(str) : boolean
  {
    if(str != "#Life 1.05" && str != "#Life 1.06")
    {
        this.errorMessage = "This software only supports Life 1.05 and Life 1.06!";
        return true;
    }
    
    return false;
  }
}

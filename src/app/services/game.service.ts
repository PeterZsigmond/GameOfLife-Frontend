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

  setCell(x, y): void
  {
    this.gameOfLife.cells[y][x] = !this.gameOfLife.cells[y][x];
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

  /*setSize(newHeight: number, newWidth: number)
  {
    //console.log("setsize: " + newHeight + " " + newWidth);

    let oldCells = this.gameOfLife.cells;
    let newCells = new Array(newHeight).fill(false).map(() => new Array(newWidth).fill(false));

    let oldHeight = this.gameOfLife.height;
    let oldWidth = this.gameOfLife.width;

    let heightDiff = newHeight - oldHeight;
    let widthDiff = newWidth - oldWidth;

    console.log(heightDiff + " " + widthDiff);
    console.log(heightDiff + " " + widthDiff);

    for(let i = 0; i < oldHeight; i++)
    {
      for(let j = 0; j < oldWidth; j++)
      {
        console.log(heightDiff + " " + widthDiff);
        newCells[i + Math.floor(heightDiff / 2)][j + Math.floor(widthDiff / 2)] = true;//oldCells[i][j];
      }
    }

    this.gameOfLife.cells = newCells;
    this.gameOfLife.height = newHeight;
    this.gameOfLife.width = newWidth;
  }*/

  processLifFile(result)
  {
    this.errorMessage = "";

    let lines = this.breakFileIntoStringArray(result);

    let height = 3;
    let width = 3;

    let cursor_hor: number;
    let cursor_vert: number;

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

          cursor_hor = Math.floor(width / 2) + (+line[1]);
          cursor_vert = Math.floor(height / 2) - (+line[2]);

          //if(+line[2] < 0)
          //{
            //console.log(cursor_hor+" " +cursor_vert);
            //cursor_vert++;
            //console.log(cursor_vert);
         // }

          //console.log(cursor_hor+" " +cursor_vert);

          continue;
        }
        
        for(let j = 0; j < lines[i].length; j++)
        {
          /*if(lines[i][j] == ".")
          {
            console.log((cursor_x + j) + ": " + cursor_y);
          }*/
          if(lines[i][j] == "*")
          {
            //console.log("* at x: " + (cursor_x + j) + ", y:" + cursor_y);
            //console.log(10 - cursor_x + j + width);
            //console.log(height + " " + cursor_hor + " " + cursor_vert);

            if(height - cursor_vert < 3)
            {
              for(let k = 0; k < cursor_vert + 2 - height; k++)
              {
                this.gameOfLife.cells.push(new Array(width).fill(false));
              }

              this.gameOfLife.height += cursor_vert + 2 - height;
              height = this.gameOfLife.height;
            }

            if(cursor_vert < 1)
            {
              console.log(cursor_hor + ":"+cursor_vert);

              let newCv = 1 - cursor_vert;

              for(let k = 0; k < 1 - cursor_vert; k++)
              {
                this.gameOfLife.cells.unshift(new Array(width).fill(false));
              }
              this.gameOfLife.height += 1 - cursor_vert;
              height = this.gameOfLife.height;
              cursor_vert += newCv;
            }

            if(width - cursor_hor < 3)
            {
              for(let k = 0; k < cursor_hor + 2 - width; k++)
              {
                for(let l = 0; l < height; l++)
                {
                  this.gameOfLife.cells[l].push(false);
                }
              }

              this.gameOfLife.width += cursor_hor + 2 - width;
              width = this.gameOfLife.width;
            }

            /*if(height - cursor_vert < 10)
            {
              let newHeight = cursor_vert + 10;
              this.setSize(newHeight, width);
              //cursor_y += Math.floor(cursor_y + 10 - height) / 2;
              height = newHeight;
              //console.log(newHeight);
            }*/
            /*if(cursor_y < 0 + 10)
            {
              this.setSize(10 - cursor_y + height, width);
              //cursor_y += (10 - cursor_y + height) / 2;
              height = 10 - cursor_y + height;
            }*/

            /*if(width - 10 < cursor_x + j)
            {
              this.setSize(height, (cursor_x + j) + 10);
              width = (cursor_x + j) + 10;
            }*/
            /*if(cursor_x + j < 0 + 10)
            {
              let newWidthh: number = 10 - (cursor_x + j) + width;
              this.setSize(height, newWidthh);
              width = newWidthh;
            }*/

            this.gameOfLife.cells[cursor_vert][cursor_hor + j] = true;
          }
        }

        cursor_vert++;
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
    this.gameOfLife.cells = new Array(height).fill(null).map(() => new Array(width).fill(false));

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

export interface IGameOfLife{
    height: number;
    width: number;
    cells: Array<Array<boolean>>;
}

export class GameOfLife implements IGameOfLife{
    height: number;
    width: number;
    cells: Array<Array<boolean>>;
}
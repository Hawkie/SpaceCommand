import { DrawContext} from "../Common/DrawContext";
import { IGameObject, StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship"
import { SparseArray } from "../Collections/SparseArray"
import { DotField } from "../Space/DotField";
import { Coordinate } from "../Common/Coordinate"
import { Asteroid } from "../Space/Asteroid"
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";


export interface IGameState
{
    update(lastDrawModifier : number);
    display(drawingContext : DrawContext);
    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number);
    tests();
    returnState() : IGameState;
}
import { DrawContext} from "../Common/DrawContext";
import { IGameObject, IHittable, StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship"
import { SparseArray } from "../Collections/SparseArray"
import { DotField } from "../Space/DotField";
import { Coordinate } from "../Common/Coordinate"
import { Asteroid } from "../Space/Asteroid"


export interface IGameState
{
    update(lastDrawModifier : number);
    display(drawingContext : DrawContext);
    input(keys : ()=> SparseArray<number>, lastDrawModifier : number);
    tests();
    hasEnded() : boolean;
}
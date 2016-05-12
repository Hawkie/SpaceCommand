import { GameObject } from "../GameObjects/GameObject";
import { IShip } from "./Ship";
import { Coordinate, Vector } from "../Physics/Common";
import { Polygon } from "../DisplayObjects/DisplayObject";
import { Transforms } from "../Physics/Transforms";
import { ForwardAccelerator } from "../Actors/Accelerators";
import { IActor } from "../Actors/Actor";
import { Mover } from "../Actors/Movers";
import { PolyView, IView } from "../Views/PolyViews";
import { GravityObjectModel } from "../Models/PolyModels";



export class LandingBasicShipModel extends GravityObjectModel {
    maxForwardForce: number;
    forwardForce : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    
    constructor(points: Coordinate[], location : Coordinate){
        var gravityForce = new Vector(180, 10);
        super(points, location, 0, 0, 0, 0, gravityForce);

        this.forwardForce = 0;
        this.maxForwardForce = 16;
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
    }
    
   
}
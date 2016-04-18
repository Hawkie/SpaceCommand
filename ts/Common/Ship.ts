import { MovingGameObject } from "./GameObject";
import { IDisplayObject } from "./DisplayObject";
import { Coordinate } from "./Coordinate";

export class Ship extends MovingGameObject {
    thrustPower : number;
    rotationalPower : number;
    constructor(displayObject : IDisplayObject, location : Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(displayObject, location, velx, vely, angle, spin);
        this.thrustPower = 16;
        this.rotationalPower = 64;
    }
    
    thrust(lastTimeModifier : number){
        this.angularThrust(this.thrustPower * lastTimeModifier)
    }
    
    rotateLeft(lastTimeModifier : number){
        this.angle -= this.rotationalPower * lastTimeModifier;
    }
    
    rotateRight(lastTimeModifier : number){
        this.angle += this.rotationalPower * lastTimeModifier;
    }
}
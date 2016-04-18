import {Coordinate } from "./Common/Coordinate";
import { IDisplayObject } from "./Common/DisplayObject";
import { MovingGameObject, GameObjectArray } from "./Common/GameObject";
import { Bullet } from "./Projectile";
import { DrawContext } from "./Common/DrawContext"
import { Transforms } from "./Common/Transforms"

export class BasicShip extends MovingGameObject {
    thrustPower : number;
    rotationalPower : number;
    projectiles : GameObjectArray;
    constructor(displayObject : IDisplayObject, location : Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(displayObject, location, velx, vely, angle, spin);
        this.thrustPower = 16;
        this.rotationalPower = 64;
        this.projectiles = new GameObjectArray();
        
    }
    
    update(lastTimeModifier : number){
        this.projectiles.update(lastTimeModifier);
        super.update(lastTimeModifier);
    }
    
    display(drawingContext : DrawContext){
        this.projectiles.display(drawingContext);
        super.display(drawingContext);    
    }
    
    thrust(lastTimeModifier : number){
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        this.angularThrust(this.thrustPower * lastTimeModifier)
    }
    
    rotateLeft(lastTimeModifier : number){
        this.angle -= this.rotationalPower * lastTimeModifier;
    }
    
    rotateRight(lastTimeModifier : number){
        this.angle += this.rotationalPower * lastTimeModifier;
    }
    
    shootPrimary(lastTimeModifier : number){
        
        var b = new Bullet(new Coordinate(this.location.x, this.location.y), this.angle);
        
        this.projectiles.add(b);
    }
}
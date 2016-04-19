import {Coordinate } from "../Common/Coordinate";
import { IDisplayObject } from "../Common/DisplayObject";
import { MovingGameObject, GameObjectArray } from "../Common/GameObject";

import { DrawContext } from "../Common/DrawContext"
import { Transforms } from "../Common/Transforms"
import { Bullet } from "../Weapons/Projectile";
import { IWeapon, BasicGun } from "../Weapons/Weapon"

export class BasicShip extends MovingGameObject {
    thrustPower : number;
    rotationalPower : number;
    primaryWeapon : IWeapon;
    constructor(displayObject : IDisplayObject, location : Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(displayObject, location, velx, vely, angle, spin);
        this.thrustPower = 16;
        this.rotationalPower = 64;
        this.primaryWeapon = new BasicGun();
        
    }
    
    update(lastTimeModifier : number){
        this.primaryWeapon.update(lastTimeModifier);
        super.update(lastTimeModifier);
    }
    
    display(drawingContext : DrawContext){
        this.primaryWeapon.display(drawingContext);
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
        
        this.primaryWeapon.pullTrigger(this.location.x, this.location.y, this.angle);
    }
}
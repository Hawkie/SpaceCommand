import {Coordinate } from "../Common/Coordinate";
import { IDisplayObject, Polygon } from "../Common/DisplayObject";
import { MovingGameObject } from "../Common/GameObject";

import { DrawContext } from "../Common/DrawContext"
import { Transforms } from "../Common/Transforms"
import { Bullet } from "../Weapons/Bullet";
import { IWeapon, BasicGun } from "../Weapons/Weapon"

//var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];

export interface IShip {
    thrust(lastTimeModifier : number);
    crash(damage : number);
}

export class BasicShip extends MovingGameObject implements IShip {
    thrustPower : number;
    rotationalPower : number;
    primaryWeapon : IWeapon;
    constructor(location : Coordinate, velx: number, vely: number, angle: number, spin: number) {
        let points = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        var triangleShip = new Polygon(points)
        
        super(triangleShip, location, velx, vely, angle, spin);
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
    
    crash(damage : number){
        console.log("Your ship crashed! The hull took " + damage + " points of damage!");
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
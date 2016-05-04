import {Coordinate } from "../Common/Coordinate";
import { IDisplayObject, Polygon, Rect } from "../DisplayObjects/DisplayObject";
import { IGameObject, MovingGameObject } from "../Common/GameObject";

import { DrawContext } from "../Common/DrawContext";
import { Transforms } from "../Common/Transforms";
import { ParticleField } from "../Space/ParticleField";
import { Bullet } from "../Weapons/Bullet";
import { IWeapon, BasicGun } from "../Weapons/Weapon"

//var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];

export interface IShip {
    
    angle: number;
    location: Coordinate;
    thrustPower: number;
    velx: number;
    vely: number;

    // methods
    thrust(lastTimeModifier: number);
    crash();
}


export class BasicShip extends MovingGameObject implements IShip {
    thrustPower : number;
    rotationalPower : number;
    primaryWeapon: IWeapon;
    thrustParticles1: ParticleField;
    explosionParticles1: ParticleField;
    points: Coordinate[];
    crashed: boolean;

    constructor(location : Coordinate, velx: number, vely: number, angle: number, spin: number) {
        var p = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        
        super(new Polygon(p), location, velx, vely, angle, spin);
        
        this.points = p;
        var triangleShip = new Polygon(this.points);
        
        this.thrustPower = 16;
        this.rotationalPower = 64;
        this.primaryWeapon = new BasicGun();
        this.thrustParticles1 = new ParticleField(this.startFromX.bind(this), this.startFromY.bind(this), this.thrustVelX.bind(this), this.thrustVelY.bind(this), new Rect(1, 1), 30, 2, 0, false);
        this.explosionParticles1 = new ParticleField(this.startFromX.bind(this), this.startFromY.bind(this), this.explosionX.bind(this), this.explosionY.bind(this), new Rect(2, 2), 40, 5,1,false);
        this.crashed = false;
    }

    
    
    update(lastTimeModifier : number){
        this.primaryWeapon.update(lastTimeModifier);
        this.thrustParticles1.update(lastTimeModifier);
        this.explosionParticles1.update(lastTimeModifier);
        super.update(lastTimeModifier);
    }
    
    display(drawContext : DrawContext){
        this.primaryWeapon.display(drawContext);
        this.thrustParticles1.display(drawContext);
        this.explosionParticles1.display(drawContext);
        if (!this.crashed) super.display(drawContext);    
    }
    
    thrust(lastTimeModifier : number){
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        if (!this.crashed) {
            this.angularThrust(this.thrustPower * lastTimeModifier)
            this.thrustParticles1.on = true;
        }
    }

    noThrust() {
        this.thrustParticles1.on = false;
    }
    
    // flash screen white. remove ship, turn on explosionParticles
    crash() {
        this.crashed = true;
        this.explosionParticles1.on = true;
        console.log("Your ship crashed!");
    }
    
    rotateLeft(lastTimeModifier: number) {
        if (!this.crashed) this.angle -= this.rotationalPower * lastTimeModifier;
    }
    
    rotateRight(lastTimeModifier : number){
        if (!this.crashed) this.angle += this.rotationalPower * lastTimeModifier;
    }
    
    shootPrimary(lastTimeModifier : number){
        if (!this.crashed) this.primaryWeapon.pullTrigger(this.location.x, this.location.y, this.angle);
    }

    startFromX(): number {
        return this.location.x;
    }

    startFromY(): number {
        return this.location.y;
    }

    thrustVelX(): number {
        let velchange = Transforms.toVector(this.angle, this.thrustPower);
        return -velchange.x + this.velx + (Math.random() * 2);
    }

    thrustVelY(): number {
        let velchange = Transforms.toVector(this.angle, this.thrustPower);
        return -velchange.y + this.vely + (Math.random() * 2);
    }

    explosionX(): number {
        return this.velx + (Math.random() * 20);
    }

    explosionY(): number {
        return this.vely + (Math.random() * 20);
    }

}
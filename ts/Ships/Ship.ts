import {Coordinate } from "../Common/Coordinate";
import { IDrawable, Polygon, Rect } from "../DisplayObjects/DisplayObject";
import { IGameObject, ILocated, IMoving, IAngled, LocatedAngledMovingGO } from "../GameObjects/GameObject";
import { MovingLocatedAngledPoly} from "../GameObjects/LocatedAngledGO";
import { DrawContext } from "../Common/DrawContext";
import { Transforms } from "../Common/Transforms";
import { ParticleField } from "../Space/ParticleField";
import { Bullet } from "../Weapons/Bullet";
import { IWeapon, BasicGun } from "../Weapons/Weapon"

//var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];

export interface IShip extends ILocated, IMoving, IAngled {
    
    thrustPower: number;

    // methods
    thrust(lastTimeModifier: number);
    crash();
}


export class BasicShip extends MovingLocatedAngledPoly implements IShip {
    thrustPower : number;
    rotationalSpeed : number;
    weapon1: IWeapon;
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
        this.rotationalSpeed = 64;
        this.weapon1 = new BasicGun();
        this.thrustParticles1 = new ParticleField(this.startFromX.bind(this), this.startFromY.bind(this), this.thrustVelX.bind(this), this.thrustVelY.bind(this), new Rect(1, 1), 20, 1, 0, false);
        this.explosionParticles1 = new ParticleField(this.startFromX.bind(this), this.startFromY.bind(this), this.explosionX.bind(this), this.explosionY.bind(this), new Rect(3, 3), 50, 5,0.2,false);
        this.crashed = false;
    }

    
    
    update(lastTimeModifier : number){
        this.weapon1.update(lastTimeModifier);
        this.thrustParticles1.update(lastTimeModifier);
        this.explosionParticles1.update(lastTimeModifier);
        if (!this.crashed) super.update(lastTimeModifier);
    }
    
    display(drawContext : DrawContext){
        this.weapon1.display(drawContext);
        this.thrustParticles1.display(drawContext);
        this.explosionParticles1.display(drawContext);
        if (!this.crashed) super.display(drawContext);    
    }
    
    thrust(lastTimeModifier : number){
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        if (!this.crashed) {
            this.angularThrust(this.thrustPower * lastTimeModifier)
            this.thrustParticles1.turnOn();
        }
    }

    protected angularThrust(thrust: number) {
        let velChange = Transforms.VectorToCartesian(this.angle, thrust);
        this.velX += velChange.x;
        this.velY += velChange.y;
    }

    noThrust() {
        this.thrustParticles1.turnOff();
    }
    
    // TODO: flash screen white. 
    // remove ship - done
    // turn on explosionParticles - done
    crash() {
        this.crashed = true;
        this.explosionParticles1.turnOn();
        console.log("Your ship crashed!");
    }
    
    rotateLeft(lastTimeModifier: number) {
        if (!this.crashed) this.angle -= this.rotationalSpeed * lastTimeModifier;
    }
    
    rotateRight(lastTimeModifier : number){
        if (!this.crashed) this.angle += this.rotationalSpeed * lastTimeModifier;
    }
    
    shootPrimary(lastTimeModifier : number){
        if (!this.crashed) this.weapon1.pullTrigger(this.location.x, this.location.y, this.angle);
    }

    startFromX(): number {
        return this.location.x;
    }

    startFromY(): number {
        return this.location.y;
    }

    thrustVelX(): number {
        let velchange = Transforms.VectorToCartesian(this.angle, this.thrustPower);
        return -velchange.x + this.velX + (Math.random() * 5);
    }

    thrustVelY(): number {
        let velchange = Transforms.VectorToCartesian(this.angle, this.thrustPower);
        return -velchange.y + this.velY + (Math.random() * 5);
    }

    explosionX(): number {
        return this.velX + ((Math.random()- 0.5) * 20);
    }

    explosionY(): number {
        return this.velY + ((Math.random()-0.5) * 20);
    }

}
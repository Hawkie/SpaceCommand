import {Coordinate } from "ts/Physics/Common";
import { IDrawable, Polygon, Rect } from "ts/DisplayObjects/DisplayObject";
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, ShapeLocatedAngledMovingRotatingModel, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels"
import { MovingSpinningObject, MovingSpinningThrustingObject } from "ts/GameObjects/Common/BaseObjects";
import { IView, GraphicView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { IActor } from "ts/Actors/Actor";
import { ForwardAccelerator } from "ts/Actors/Accelerators";
import { ParticleGenerator } from "ts/Actors/ParticleFieldUpdater";
import { DrawContext } from "ts/Common/DrawContext";
import { Transforms } from "ts/Physics/Transforms";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { BulletModel } from "ts/Models/Weapons/Bullet";
import { IWeapon, BasicGunModel } from "ts/Models/Weapons/Weapon"

//var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];

export interface IShip {
    
    // methods
    left(timeModifier: number);
    right(timeModifier: number);
    thrust();
    noThrust();
    crash();
}

export interface IFiringShip extends IShip {
    shootPrimary();
}

export interface IShipModel extends IShapeLocatedAngledMovingRotataingAccelerating {
    maxForwardForce: number;
    maxRotationalSpeed: number;
    crashed: boolean;
}


export class BasicShipModel extends ShapeLocatedAngledMovingRotatingModel {
    maxForwardForce: number;
    forwardForce: number;
    maxRotationalSpeed : number;
    crashed: boolean;

    constructor(collisionPoly: Coordinate[], location: Coordinate, velx: number, vely: number, angle: number, spin: number) {
        super(collisionPoly, location, velx, vely, angle, spin);
        this.points = collisionPoly;
        this.forwardForce = 0;
        this.maxForwardForce = 16;
        this.maxRotationalSpeed = 64;
        this.crashed = false;
    }

    thrustVelX(): number {
        let velchange = Transforms.VectorToCartesian(this.angle, this.forwardForce);
        return -velchange.x + this.velX + (Math.random() * 5);
    }

    thrustVelY(): number {
        let velchange = Transforms.VectorToCartesian(this.angle, this.forwardForce);
        return -velchange.y + this.velY + (Math.random() * 5);
    }

    explosionX(): number {
        return this.velX + ((Math.random()- 0.5) * 20);
    }

    explosionY(): number {
        return this.velY + ((Math.random()-0.5) * 20);
    }

}
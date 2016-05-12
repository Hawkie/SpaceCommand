import {Coordinate } from "../../Physics/Common";
import { IDrawable, Polygon, Rect } from "../../DisplayObjects/DisplayObject";
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, ShapeLocatedAngledMovingRotatingModel, IShapeLocatedAngledMovingRotataingAccelerating } from "../../Models/PolyModels"
import { MovingSpinningObject, MovingSpinningThrustingObject } from "../../GameObjects/SpaceObject";
import { IView, GraphicView, PolyView, ParticleFieldView } from "../../Views/PolyViews";
import { IActor } from "../../Actors/Actor";
import { ForwardAccelerator } from "../../Actors/Accelerators";
import { ParticleFieldUpdater } from "../../Actors/ParticleFieldUpdater";
import { DrawContext } from "../../Common/DrawContext";
import { Transforms } from "../../Physics/Transforms";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "../../Models/ParticleFieldModel";
import { BulletModel } from "../../Models/Weapons/Bullet";
import { IWeapon, BasicGunModel } from "../../Models/Weapons/Weapon"

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

export interface ICollisionDetection {
    hitTest(point: Coordinate);
    hit();
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
  
    startFromX(): number {
        return this.location.x;
    }

    startFromY(): number {
        return this.location.y;
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
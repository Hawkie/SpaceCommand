import { Coordinate } from "ts/Physics/Common";
import { IDrawable, Polygon, Rect } from "ts/DisplayObjects/DisplayObject";
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, ShapeLocatedAngledMovingRotatingData, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels"
import { ShapeMovingThrustingModel } from "ts/Models/DynamicModels";
import { IView, GraphicView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { IActor } from "ts/Actors/Actor";
import { ForwardAccelerator } from "ts/Actors/Accelerators";
import { ParticleGenerator } from "ts/Actors/ParticleFieldUpdater";
import { DrawContext } from "ts/Common/DrawContext";
import { Transforms } from "ts/Physics/Transforms";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData } from "ts/Models/ParticleFieldModel";
import { ParticleDataVectorConstructor } from "ts/Models/Weapons/Bullet";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon"
import { IShipData } from "ts/Models/Ships/Ship";

//var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];


export class BasicShipData extends ShapeLocatedAngledMovingRotatingData implements IShipData {
    maxForwardForce: number;
    forwardForce: number;
    maxRotationalSpeed: number;
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
}

export class BasicShipModel extends ShapeMovingThrustingModel<BasicShipData>{
    constructor(data: BasicShipData) {
        super(data, []);
    }
}
import { Coordinate } from "ts/Physics/Common";
import { IDrawable, Polygon, Rect } from "ts/DisplayObjects/DisplayObject";
import { ILocated, IMoving, IAngled, IRotating, IForwardAccelerator, ShapeLocatedAngledMovingRotatingData, IShapeLocatedAngledMovingRotataingAccelerating } from "ts/Models/PolyModels"
import { ShapeMovingThrustingModel } from "ts/Models/DynamicModels";
import { IView, GraphicView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { IActor } from "ts/Actors/Actor";
import { ForwardAccelerator } from "ts/Actors/Accelerators";
import { DrawContext } from "ts/Common/DrawContext";
import { Transforms } from "ts/Physics/Transforms";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { ParticleDataVectorConstructor } from "ts/Models/Weapons/Bullet";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon"
import { IShipData, IFiringShipModel } from "ts/Models/Ships/Ship";

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

export class BasicShipModel extends ShapeMovingThrustingModel<BasicShipData> implements IFiringShipModel {
    weaponModel: IWeaponData;
    thrustParticleModel: ParticleFieldModel;
    explosionParticleModel: ParticleFieldModel;

    constructor(data: BasicShipData) {
        var weaponModel: IWeaponData = new WeaponData();
        var weaponUpdater: IActor = new ParticleFieldMover(weaponModel);
        
        // use particle field model!
        var thrustParticleData = new ParticleFieldData(20, 1, 0, false);
        var thrustParticleModel: ParticleFieldModel = new ParticleFieldModel(thrustParticleData,
            (now: number) => new MovingParticleModel(new ParticleData(data.location.x,
                data.location.y,
                data.thrustVelX(),
                data.thrustVelY(),
                now)));
        

        var explosionParticleData = new ParticleFieldData(50, 5, 0.2, false);
        var explosionParticleModel: ParticleFieldModel = new ParticleFieldModel(explosionParticleData,
            (now: number) => new MovingParticleModel(new ParticleData(data.location.x,
                data.location.y,
                data.velX + ((Math.random() - 0.5) * 20),
                data.velY + ((Math.random() - 0.5) * 20),
                now)));

        var actors: IActor[] = [weaponUpdater, thrustParticleModel, explosionParticleModel];
        
        super(data, actors);

        this.weaponModel = weaponModel;
        this.thrustParticleModel = thrustParticleModel;
        this.explosionParticleModel = explosionParticleModel;
    }

    // TODO: MOve these to model
    thrust() {
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        if (!this.data.crashed) {
            this.data.forwardForce = this.data.maxForwardForce;
            this.thrustParticleModel.turnOn();
        }
    }

    noThrust() {
        this.data.forwardForce = 0;
        this.thrustParticleModel.turnOff();
    }
    
    // TODO: flash screen white. 
    // remove ship - done
    // turn on explosionParticles - done
    crash() {
        this.data.crashed = true;
        this.explosionParticleModel.turnOn();
        console.log("Your ship crashed!");
    }

    left(lastTimeModifier: number) {
        if (!this.data.crashed) this.data.angle -= this.data.maxRotationalSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        if (!this.data.crashed) this.data.angle += this.data.maxRotationalSpeed * lastTimeModifier;
    }

    shootPrimary() {
        if (!this.data.crashed) this.weaponModel.pullTrigger(this.data.location.x, this.data.location.y, this.data.angle);
    }
}
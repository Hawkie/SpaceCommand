import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { PolyView, IView } from "ts/Views/PolyViews";
import { ShapeLocatedAngledMovingRotatingAcceleratingData } from "ts/Models/PolyModels";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingGravityParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";

import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";



export class LandingBasicShipData extends ShapeLocatedAngledMovingRotatingAcceleratingData {
    maxForwardForce: number;
    forwardForce : number;
    leftRightSpeed : number;
    leftRightSlowing : number;
    
    constructor(points: Coordinate[], location : Coordinate){
        var gravityForce = new Vector(180, 10);
        super(points, location, 0, 0, 0, 0, gravityForce);

        this.forwardForce = 0;
        this.maxForwardForce = 16;
        this.leftRightSpeed = 32;
        this.leftRightSlowing = 2;
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

export class LandingShipModel extends DynamicModel<LandingBasicShipData> {

    crashed: boolean;
    thrustParticleModel: ParticleFieldModel;
    explosionParticleModel: ParticleFieldModel;

    constructor(data: LandingBasicShipData) {

        var thrustParticlesData = new ParticleFieldData(20, 1, 0, false);
        var thrustParticlesModel: ParticleFieldModel = new ParticleFieldModel(thrustParticlesData,
            (now: number) => new MovingGravityParticleModel(new ParticleData(data.location.x,
                data.location.y,
                data.thrustVelX(),
                data.thrustVelY(),
                now)));

        var explosionParticlesData = new ParticleFieldData(100, 5, 0.2, false);
        var explosionParticlesModel: ParticleFieldModel = new ParticleFieldModel(explosionParticlesData,
            (now: number) => new MovingGravityParticleModel(new ParticleData(data.location.x,
                data.location.y,
                (Math.random() - 0.5) * 20,
                (Math.random() * -30),
                now)));

        var mover: IActor = new Mover(data);
        var thrust = new ForwardAccelerator(data);
        var gravityForce = new VectorAccelerator(data, new Vector(180, 10));
        super(data, [mover, thrust, gravityForce, thrustParticlesModel, explosionParticlesModel]);
        this.crashed = false;
        this.thrustParticleModel = thrustParticlesModel;
        this.explosionParticleModel = explosionParticlesModel;

    }

    // Move to Model
    thrust() {
        // TODO: Play thrust sfx
        if (!this.crashed) {
            this.data.forwardForce = this.data.maxForwardForce;
            this.thrustParticleModel.turnOn();
        }
    }

    noThrust() {
        this.data.forwardForce = 0;
        this.thrustParticleModel.turnOff();
    }

    crash() {
        this.crashed = true;
        this.explosionParticleModel.turnOn();
        console.log("Your crashed your ship while landing!");
    }

    left(lastTimeModifier: number) {
        this.data.velX -= this.data.leftRightSpeed * lastTimeModifier;
    }

    right(lastTimeModifier: number) {
        this.data.velX += this.data.leftRightSpeed * lastTimeModifier;
    }

    notMovingOnX(lastDrawModifier: number) {
        if (this.data.velX < 0) {
            this.data.velX += (this.data.leftRightSlowing * lastDrawModifier);
            if (this.data.velX >= 0) this.data.velX = 0;
        }
        else if (this.data.velX > 0) {
            this.data.velX -= (this.data.leftRightSlowing * lastDrawModifier);
            if (this.data.velX < 0) this.data.velX = 0;
        }
    }
}
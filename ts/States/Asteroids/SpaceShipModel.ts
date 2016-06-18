﻿import { Coordinate } from "ts/Physics/Common";
import { BasicShipData } from "ts/Data/ShipData";
import { ShapeData } from "ts/Data/ShapeData";
import { DynamicModel, ShapedModel } from "ts/Models/DynamicModels";
import { IView } from "ts/Views/View";
import { IActor } from "ts/Actors/Actor";
import { ForwardAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { PolyRotator } from "ts/Actors/Rotators";
import { DrawContext } from "ts/Common/DrawContext";
import { Transforms } from "ts/Physics/Transforms";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { IWeaponData, WeaponData } from "ts/Models/Weapons/Weapon"
import { IFiringShipModel } from "ts/Models/Ships/Ship";

//var SHIPPOINTS = [0, -4, -2, 2, 0, 1, 2, 2, 0, -4];

export class BasicShipModel extends ShapedModel<BasicShipData, ShapeData> implements IFiringShipModel {
    weaponModel: IWeaponData;
    thrustParticleModel: ParticleFieldModel;
    explosionParticleModel: ParticleFieldModel;

    constructor(data: BasicShipData) {
        var triangleShip = [new Coordinate(0, -4), new Coordinate(-2, 2), new Coordinate(0, 1), new Coordinate(2, 2), new Coordinate(0, -4)];
        Transforms.scale(triangleShip, 2, 2);
        var shape = new ShapeData(triangleShip);
        var weaponModel: IWeaponData = new WeaponData();
        var weaponUpdater: IActor = new ParticleFieldMover(weaponModel);
        
        // use particle field model!
        var thrustParticleData = new ParticleFieldData(20, 1, 0, false);
        var thrustParticleModel: ParticleFieldModel = new ParticleFieldModel(thrustParticleData,
            (now: number) => {
                var p = new ParticleData(data.location.x + shape.points[2].x,
                    data.location.y + shape.points[2].y,
                    data.thrustVelX(),
                    data.thrustVelY(),
                    now);
                var mover = new Mover(p);
                return new ParticleModel(p, [mover]);
            });

        var explosionParticleData = new ParticleFieldData(50, 5, 0.2, false);
        var explosionParticleModel: ParticleFieldModel = new ParticleFieldModel(explosionParticleData,
            (now: number) => {
                var p = new ParticleData(data.location.x,
                    data.location.y,
                    data.velX + ((Math.random() - 0.5) * 20),
                    data.velY + ((Math.random() - 0.5) * 20),
                    now);
                var mover = new Mover(p);
                return new ParticleModel(p, [mover]);
            });


        var mover: IActor = new Mover(data);
        var thrust = new ForwardAccelerator(data);
        var rotator = new PolyRotator(data, shape);

        var actors: IActor[] = [mover, thrust, rotator, weaponUpdater, thrustParticleModel, explosionParticleModel];
        
        super(data, shape, actors);

        this.weaponModel = weaponModel;
        this.thrustParticleModel = thrustParticleModel;
        this.explosionParticleModel = explosionParticleModel;
    }

    thrust() {
        //var audio = new Audio("./wav/thrust.wav");
        //audio.play();
        if (!this.data.crashed) {
            this.data.forwardForce = this.data.maxForwardForce;
            this.thrustParticleModel.turnOn();
        } else {
            this.noThrust();
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
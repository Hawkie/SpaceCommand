﻿import { ICoordinate, Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving, LocatedMovingData } from "ts/Data/PhysicsData";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IActor } from "ts/Actors/Actor"
import { Mover } from "ts/Actors/Movers";
import { VectorAccelerator } from "ts/Actors/Accelerators";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { DynamicModel } from "ts/Models/DynamicModels";

export class MovingParticleModel extends DynamicModel<IParticleData> {
    constructor(model: IParticleData) {
        var mover = new Mover(model);
        super(model, [mover]);
    }
}

export class MovingGravityParticleModel extends DynamicModel<IParticleData>{
    constructor(model: IParticleData) {
        var mover = new Mover(model);
        var vectorAccelerator = new VectorAccelerator(model, new Vector(180, 10));
        super(model, [mover, vectorAccelerator]);
    }
}

export class ParticleFieldModel extends DynamicModel<IParticleFieldData> {
    constructor(data: IParticleFieldData, createParticle: (now: number) => DynamicModel<IParticleData>) {
        var generator: ParticleGenerator = new ParticleGenerator(data, createParticle);
        var mover: ParticleFieldMover = new ParticleFieldMover(data);
        super(data, [generator, mover]);
    }

    turnOn() {
        this.data.on = true;
    }

    turnOff() {
        this.data.on = false;
    }
}
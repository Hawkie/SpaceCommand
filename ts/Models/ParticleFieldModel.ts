import { ICoordinate, Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving, LocatedMovingData } from "ts/Data/PhysicsData";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { IActor } from "ts/Actors/Actor"
import { Mover } from "ts/Actors/Movers";
import { VectorAccelerator } from "ts/Actors/Accelerators";
import { ParticleGenerator, ParticleModelUpdater } from "ts/Actors/ParticleFieldUpdater";
import { DynamicModel } from "ts/Models/DynamicModels";

export class ParticleModel extends DynamicModel<IParticleData> {
    constructor(model: IParticleData, actors:IActor[]) {
        super(model, actors);
    }
}


export class ParticleFieldModel extends DynamicModel<IParticleFieldData> {
    constructor(data: IParticleFieldData, createParticle: (now: number) => DynamicModel<IParticleData>) {
        var generator: ParticleGenerator = new ParticleGenerator(data, createParticle);
        var mover: ParticleModelUpdater = new ParticleModelUpdater(data);
        super(data, [generator, mover]);
    }

    turnOn() {
        this.data.on = true;
    }

    turnOff() {
        this.data.on = false;
    }
}
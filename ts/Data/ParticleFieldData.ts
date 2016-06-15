import { ICoordinate, Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving, LocatedMovingData } from "ts/Data/PhysicsData";
import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IParticleData, ParticleData} from "ts/Data/ParticleData";

export interface IParticleFieldData {
    particles: IModel<IParticleData>[];
    // how frequently a particle appears
    itemsPerSec: number;
    //lastAdded: number;

    // how long a particle survives
    lifeTimeInSec: number;
    range: number;
    maxNumber: number;

    // fadeOut
    firstAdded: number;
    generationTimeInSec: number;

    // init
    lastCheck: number;

    on: boolean;
}

export class ParticleFieldData implements IParticleFieldData {
    particles: DynamicModel<IParticleData>[];

    // how frequently a particle appears
    itemsPerSec: number;
    //lastAdded: number;

    // how long a particle survives
    lifeTimeInSec: number;
    range: number;
    maxNumber: number;

    // fadeOut
    firstAdded: number;
    generationTimeInSec: number;

    // init
    lastCheck: number;
    on: boolean;

    constructor(itemsPerSecond: number, lifeTimeInSec: number = 0, fadeOutInSec: number = 0, on: boolean = true) {
        this.particles = [];

        this.lifeTimeInSec = lifeTimeInSec;

        // TODO
        this.range = 0;
        this.maxNumber = 0;

        this.firstAdded = 0;
        this.lastCheck = Date.now();
        this.itemsPerSec = itemsPerSecond;

        this.generationTimeInSec = fadeOutInSec;
        this.on = on;
    }
}

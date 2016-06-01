import { ICoordinate, Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving, LocatedMovingData } from "ts/Data/PhysicsData";
import { IActor } from "ts/Actors/Actor"
import { Mover } from "ts/Actors/Movers";
import { VectorAccelerator } from "ts/Actors/Accelerators";
import { ParticleGenerator, ParticleFieldMover } from "ts/Actors/ParticleFieldUpdater";
import { DynamicModel } from "ts/Models/DynamicModels";

export interface IParticleFieldData {
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
}

export interface IParticleData extends ILocatedMoving {
    born: number;
    originX: number;
    originY: number;
}

export class ParticleData extends LocatedMovingData implements IParticleData {
    private origin: Coordinate;
    constructor(locationx: number, locationy: number, velX: number, velY: number, private bornTime: number) {
        super(new Coordinate(locationx, locationy), velX, velY);
        this.origin = new Coordinate(locationx, locationy);
    } 

    get born(): number { 
        return this.bornTime;
    }
    get originX(): number {
        return this.origin.x;
    }
    get originY(): number {
        return this.origin.y;
    }
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

    constructor(itemsPerSecond : number, lifeTimeInSec : number = 0, fadeOutInSec : number = 0, on : boolean = true) {
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
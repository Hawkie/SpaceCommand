import { ICoordinate, Coordinate } from "ts/Physics/Common";
import { IShape, ILocatedMoving, LocatedMovingModel } from "ts/Models/PolyModels";

export interface IParticleFieldModel {
    points: IParticleModel[];
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

    turnOn();
    turnOff();
}

export interface IParticleModel extends ILocatedMoving {
    born: number;
    originX: number;
    originY: number;
}

export class ParticleModel extends LocatedMovingModel implements IParticleModel {
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

export class ParticleFieldModel implements IParticleFieldModel {
    points: IParticleModel[];

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
        this.points = [];
        
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

    turnOn() {
        this.on = true;
    }

    turnOff() {
        this.on = false;
    }
}
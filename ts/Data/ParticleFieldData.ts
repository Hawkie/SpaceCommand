import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving, LocatedMovingData } from "ts/Data/PhysicsData";
//import { IModel, DynamicModel } from "ts/Models/DynamicModels";
import { IParticleData, ParticleData} from "ts/Data/ParticleData";

//export interface IParticleFieldData {
//    particles: IModel<IParticleData>[];
//    // how frequently a particle appears
//    itemsPerSec: number;
//    //lastAdded: number;

//    // how long a particle survives
//    lifeTimeInSec: number;
//    range: number;
//    maxNumber: number;

//    // fadeOut
//    firstAdded: number;
//    generationTimeInSec: number;

//    // init
//    lastCheck: number;

//    on: boolean;
//}

//export class ParticleFieldData implements IParticleFieldData {
export class ParticleFieldData {
    //particles: IModel<IParticleData>[];

    // how frequently a particle appears TODO move to generator
    
    //lastAdded: number;

    // how long a particle survives
    range: number;
    maxNumber: number;

    // fadeOut
    firstAdded: number;

    // init
    lastCheck: number;
    on: boolean;

    constructor(public itemsPerSec: number,
        public maxGeneratedPerIteration: number,
        public lifeTimeInSec: number = undefined,
        public generationTimeInSec: number = undefined,
        on: boolean = true) {
        //this.particles = [];

        // TODO
        this.range = 0;
        this.maxNumber = 0;

        this.firstAdded = 0;
        this.lastCheck = Date.now();

        
        this.on = on;
    }
}

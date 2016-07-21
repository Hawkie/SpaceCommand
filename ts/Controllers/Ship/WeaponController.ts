import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving, ILocatedAngledMoving } from "ts/Data/PhysicsData";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { ShapeData, RectangleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
import { RectangleView } from "ts/Views/PolyViews";
import { FXObject } from "ts/Sound/FXObject";
import { SoundEffectData } from "ts/States/SoundDesigner/SoundEffectsModel";

export class WeaponController {
    laserEffect = new SoundEffectData(
    1046.5,           //frequency
    0,                //attack
    0.3,              //decay
    "sawtooth",       //waveform
    1,                //Volume
    -0.8,             //pan
    0,                //wait before playing
    1200,             //pitch bend amount
    false,            //reverse bend
    25,               //dissonance
    [0.1, 0.2, 2000], //echo: [delay, feedback, filter]
    undefined,        //reverb: [duration, decay, reverse?]
    3);                 //Maximum duration of sound, in seconds

    laserSound: FXObject;

    soundPlayed: boolean = false;
    last: number;

    constructor(public field: MultiGameObject<ParticleFieldData,
        SingleGameObject<ParticleData>>,
        actx: AudioContext) {
        this.laserSound = new FXObject(actx, this.laserEffect);
        this.last = Date.now();
    }

    pullTrigger(data: ILocatedAngledMoving, offsetAngle: number = 0, velocity: number = 128) {
        // put firerate check in here
        let now = Date.now();
        let elapsedTimeSec = (now - this.last)/1000;
        if (elapsedTimeSec >= 1/this.field.model.itemsPerSec) {
            this.last = now;
            var p = new ParticleDataVectorConstructor(new Coordinate(data.location.x,
                data.location.y),
                new Vector(data.angle + offsetAngle, velocity),
                Date.now());
            var mover = new Mover(p);
            var view = new RectangleView(p, new RectangleData(1, 1));
            let pObj = new SingleGameObject<ParticleData>(p, [mover], [view]);
            this.field.components.push(pObj);
            this.laserSound.play();
        }
    }


    static createWeaponController(actx: AudioContext): WeaponController {
        let fieldData: ParticleFieldData = new ParticleFieldData(2, 5, 2, false);
        let pField: SingleGameObject<ParticleData>[] = [];
        
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [remover], [], pField);
        return new WeaponController(field, actx);
    }

}
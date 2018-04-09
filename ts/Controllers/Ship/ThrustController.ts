import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
// Data
import { IBreakable, BreakableData } from "ts/Data/BreakableData";
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForces } from "ts/Data/PhysicsData";
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { ShapeData, RectangleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
// Actors
import { IAcceleratorInputs, IAcceleratorOutputs, Accelerator } from "ts/Actors/Accelerator";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { PolyRotator } from "ts/Actors/Rotators";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
// GameObjects
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
// Views
import { RectangleView2, PolyView } from "ts/Views/PolyViews";

import { Model, ShapedModel, GPSModel } from "ts/Models/DynamicModels";
import { ShipComponentObject, ShipComponents } from "ts/Controllers/Ship/ShipComponents";
import { IView } from "../../Views/View";

export interface IThrustController extends IGameObject {
    on();
    off();
    engine: ShipComponentObject;
    thrustField: MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>>
}

export class ThrustController extends ComponentObjects<IGameObject> implements IThrustController {
    thrustSound = new AudioObject("res/sound/thrust.wav", true);
    soundPlayed: boolean = false;

    constructor(public thrustField: MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>>,
        public engine: ShipComponentObject   ) {
        super([thrustField, engine]);
    }

    on() {
        this.thrustField.model.on = true;
        if (!this.soundPlayed) {
            this.thrustSound.play();
            this.soundPlayed = true;
        }
    }

    off() {
        this.thrustField.model.on = false;
        this.thrustSound.pause();
        this.soundPlayed = false;
    }

    static createGroundThrust(data: ILocatedAngledMovingRotatingForces, shape: ShapeData): ThrustController {
        let fieldData: ParticleFieldData = new ParticleFieldData(20, undefined, 1, undefined, false);
        let pField: SingleGameObject<ParticleData>[] = [];

        // get thrust
        let thrust = data.forces[0];

        var generator: ParticleGenerator = new ParticleGenerator(fieldData, pField, (now: number) => {
            var p = new ParticleDataVectorConstructor(new Coordinate(data.location.x + shape.points[2].x + Transforms.random(-2, 2),
                data.location.y + shape.points[2].y + Transforms.random(-2, 2)),
                new Vector(thrust.angle + Transforms.random(-5, 5) + 180,
                    thrust.length * 5 + Transforms.random(-5, 5)),
                now);
            var mover = new Mover(p);
            var getAcceleratorProps: () => IAcceleratorInputs = () => {
                return {
                    x: p.location.x,
                    y:p.location.y,
                    Vx:p.velX,
                    Vy:p.velY,
                    forces:[new Vector(180, 1)],
                    mass:0.1
                };
            };
            var gravity: Accelerator = new Accelerator(getAcceleratorProps, (out: IAcceleratorOutputs)=> {
                p.velX += out.Vx;
                p.velY += out.Vy;
            });
            var view: IView = new RectangleView2(()=> { return {
                x: p.location.x,
                y: p.location.y,
                width: 1,
                height: 1,
            };});
            return new SingleGameObject<ParticleData>(p, [mover, gravity], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [generator, remover], [], pField);
        var engine = ShipComponents.createEngine(data);
        // todo engine types are different!
        var tc = new ThrustController(field, engine);
        return tc;
    }

    static createSpaceThrust(data: ILocatedAngledMovingRotatingForces, shape: ShapeData): ThrustController {
        let fieldData: ParticleFieldData = new ParticleFieldData(20, undefined, 1, undefined, false);
        let pField: SingleGameObject<ParticleData>[] = [];

        // add thrust
        let thrust = data.forces[0];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, pField, (now: number) => {
            var p = new ParticleDataVectorConstructor(new Coordinate(data.location.x + shape.points[2].x + Transforms.random(-2, 2),
                data.location.y + shape.points[2].y + Transforms.random(-2, 2)),
                new Vector(thrust.angle + Transforms.random(-5, 5) + 180,
                    thrust.length * 5 + Transforms.random(-5, 5)),
                now);
            var mover = new Mover(p);
            var view:IView = new RectangleView2(()=> { return {
                x: p.location.x,
                y: p.location.y,
                width: 1,
                height: 1,
            };});
            return new SingleGameObject<ParticleData>(p, [mover], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [generator, remover], [], pField);
        var engine = ShipComponents.createEngine(data);
        return new ThrustController(field, engine);
    }
}
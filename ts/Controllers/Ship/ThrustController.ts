import { Coordinate, Vector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
// data
import { IBreakable, BreakableData } from "ts/Data/BreakableData";
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForces } from "ts/Data/PhysicsData";
import { ShapeData } from "ts/Data/ShapeData";
// actors
import { IAcceleratorInputs, IAcceleratorOutputs, Accelerator } from "ts/Actors/Accelerator";
import { IActor } from "ts/Actors/Actor";
import { PolyRotator } from "ts/Actors/Rotators";
import { IParticleGenInputs } from "ts/Actors/ParticleFieldUpdater";
// gameObjects
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field, IParticle } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
// views
import { RectangleView, PolyView } from "ts/Views/PolyViews";

import { Model, ShapedModel, GPSModel } from "ts/Models/DynamicModels";
import { ShipComponentObject, ShipComponents } from "ts/Controllers/Ship/ShipComponents";
import { IView } from "../../Views/View";

export interface IThrustController extends IGameObject {
    on(): void;
    off(): void;
    engine: ShipComponentObject;
    thrustField: IGameObject;
}

export class ThrustController extends ComponentObjects<IGameObject> implements IThrustController {
    thrustSound = new AudioObject("res/sound/thrust.wav", true);
    soundPlayed: boolean = false;

    constructor(public thrustField: IGameObject,
        public fieldSwitcher: (on:boolean)=>void,
        public engine: ShipComponentObject   ) {
        super([thrustField, engine]);
    }

    on(): void {
        this.fieldSwitcher(true);
        if (!this.soundPlayed) {
            this.thrustSound.play();
            this.soundPlayed = true;
        }
    }

    off(): void {
        this.fieldSwitcher(false);
        this.thrustSound.pause();
        this.soundPlayed = false;
    }

    static createThrust(data: ILocatedAngledMovingRotatingForces, shape: ShapeData, gravityOn: boolean): ThrustController {
        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            Field.createThrust(() => { return {
                x: data.location.x,
                y: data.location.y,
                gravityOn: gravityOn,
                thrust: data.forces[0],
                xOffset: shape.points[2].x,
                yOffset: shape.points[2].y,
            };});

        var engine: ShipComponentObject = ShipComponents.createEngine(data);
        // todo engine types are different!
        var tc: ThrustController = new ThrustController(field,
            (on: boolean) => {
                field.model.on = on;
            },
            engine);
        return tc;
    }
}
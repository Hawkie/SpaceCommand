import { Coordinate, Vector, IVector } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
// data
// import { IBreakable, BreakableData } from "ts/Data/BreakableData";
import { ILocated, ILocatedAngledMoving, ILocatedAngledMovingRotatingForces } from "ts/Data/PhysicsData";
import { ShapeData, IShape } from "ts/Data/ShapeData";
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

import { ShapedModel, GPSModel } from "ts/Models/DynamicModels";
import { ShipComponents } from "ts/Controllers/Ship/ShipComponents";
import { IView } from "../../Views/View";

export interface IThrustController extends IGameObject {
    on(): void;
    off(): void;
    // engine: ShipComponentObject;
    thrustField: IGameObject;
}

export interface IThrustInputs {
    x: number;
    y:number;
    thrust: IVector;
    shape: IShape;
    gravityOn: boolean;
}

export class ThrustController extends ComponentObjects<IGameObject> implements IThrustController {
    thrustSound = new AudioObject("res/sound/thrust.wav", true);
    soundPlayed: boolean = false;

    constructor(public thrustField: IGameObject,
        public fieldSwitcher: (on:boolean)=>void,) {
        // public engine: ShipComponentObject   ) {
        super([thrustField]);
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

    static createThrust(getInputs: ()=> IThrustInputs): IThrustController {
        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            Field.createExhaustObj(() => {
                var inputs: IThrustInputs = getInputs();
                return {
                    x: inputs.x,
                    y: inputs.y,
                    gravityOn: inputs.gravityOn,
                    thrust: inputs.thrust,
                    xOffset: inputs.shape.offset.x,
                    yOffset: inputs.shape.offset.y,
                };
            });

        // var engine: ShipComponentObject = ShipComponents.createEngine(data);
        // todo engine types are different!
        var tc: ThrustController = new ThrustController(field,
            (on: boolean) => {
                field.model.on = on;
            });
        return tc;
    }
}
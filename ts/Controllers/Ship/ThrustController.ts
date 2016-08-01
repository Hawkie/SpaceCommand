import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedAngledMovingRotatingForwardAcc } from "ts/Data/PhysicsData";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { ShapeData, RectangleData } from "ts/Data/ShapeData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { IGameObject, SingleGameObject, ComponentObjects, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
import { RectangleView } from "ts/Views/PolyViews";
import { Transforms } from "ts/Physics/Transforms";

export class ThrustController extends ComponentObjects<IGameObject> {
    thrustSound = new AudioObject("res/sound/thrust.wav", true);
    soundPlayed: boolean = false;

    constructor(public field: MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>>) {
        super([field]);
    }

    on() {
        this.field.model.on = true;
        if (!this.soundPlayed) {
            this.thrustSound.play();
            this.soundPlayed = true;
        }
    }

    off() {
        this.field.model.on = false;
        this.thrustSound.pause();
        this.soundPlayed = false;
    }

    static createGroundThrust(data: ILocatedAngledMovingRotatingForwardAcc, shape: ShapeData): ThrustController {
        let fieldData: ParticleFieldData = new ParticleFieldData(20, undefined, 1, undefined, false);
        let pField: SingleGameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, pField, (now: number) => {
            var p = new ParticleDataVectorConstructor(new Coordinate(data.location.x + shape.points[2].x + Transforms.random(-2, 2),
                data.location.y + shape.points[2].y + Transforms.random(-2, 2)),
                new Vector(data.angle + Transforms.random(-5, 5) + 180,
                    data.forwardForce * 5 + Transforms.random(-5, 5)),
                now);
            var mover = new Mover(p);
            var gravity = new VectorAccelerator(p, new Vector(180, 10));
            var view = new RectangleView(p, new RectangleData(1, 1));
            return new SingleGameObject<ParticleData>(p, [mover, gravity], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [generator, remover], [], pField);
        return new ThrustController(field);
    }

    static createSpaceThrust(data: ILocatedAngledMovingRotatingForwardAcc, shape: ShapeData): ThrustController {
        let fieldData: ParticleFieldData = new ParticleFieldData(20, undefined, 1, undefined, false);
        let pField: SingleGameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, pField, (now: number) => {
            var p = new ParticleDataVectorConstructor(new Coordinate(data.location.x + shape.points[2].x + Transforms.random(-2, 2),
                data.location.y + shape.points[2].y + Transforms.random(-2, 2)),
                new Vector(data.angle + Transforms.random(-5, 5) + 180,
                    data.forwardForce * 5 + Transforms.random(-5, 5)),
                now);
            var mover = new Mover(p);
            var view = new RectangleView(p, new RectangleData(1, 1));
            return new SingleGameObject<ParticleData>(p, [mover], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [generator, remover], [], pField);
        return new ThrustController(field);
    }
}
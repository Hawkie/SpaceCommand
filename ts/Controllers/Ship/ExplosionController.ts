import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocated, ILocatedMoving, LocatedData } from "ts/Data/PhysicsData";
import { IAcceleratorInputs, IAcceleratorOutputs, Accelerator } from "ts/Actors/Accelerator";
import { Mover } from "ts/Actors/Movers";
import { Flasher } from "ts/Actors/Switches";
import { IActor } from "ts/Actors/Actor";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { ShapeData, RectangleData } from "ts/Data/ShapeData";
import { EffectData } from "ts/Data/EffectData";
import { ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleGenerator, ParticleRemover } from "ts/Actors/ParticleFieldUpdater";
import { SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
import { RectangleView2 } from "ts/Views/PolyViews";
import { ScreenFlashView } from "ts/Views/EffectViews";
import { IGameObject, ComponentObjects } from "ts/GameObjects/GameObject";
import { IView } from "../../Views/View";

// a controller has a specific interface (e.g. on/off) so change the state of its game objects
// it is also a game object.

export interface IExplosionController extends IGameObject {
    field: MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>>;
    screenFlash: SingleGameObject<EffectData>;

    on();
    off();
}

export class ExplosionController extends ComponentObjects<IGameObject> implements IExplosionController  {
    explosionSound: AudioObject = new AudioObject("res/sound/explosion.wav");
    soundPlayed: boolean = false;

    constructor(public field: MultiGameObject<ParticleFieldData, SingleGameObject<ParticleData>>,
        public screenFlash: SingleGameObject<EffectData>) {
        super([field, screenFlash]);
    }

    on() {
        this.field.model.on = true;
        this.screenFlash.model.enabled = true;
        if (!this.soundPlayed) {
            this.explosionSound.play();
            this.soundPlayed = true;
        }
    }

    off() {
        this.field.model.on = false;
        this.screenFlash.model.enabled = false;
        this.explosionSound.pause();
        this.soundPlayed = false;
        
    }

    // flash and field separate?
    static createFlash(located:ILocated) : SingleGameObject<EffectData> {
        let e = new EffectData();
        let s = new Flasher(e);
        let flash = new SingleGameObject<EffectData>(e, [s], [new ScreenFlashView(located, e)]);
        return flash;
    }

    static createGroundExplosion(data: ILocatedMoving): ExplosionController {
        let fieldData: ParticleFieldData = new ParticleFieldData(50, undefined, 5, 0.2, false);
        let pField: SingleGameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, pField, (now: number) => {
                var p = new ParticleData(data.location.x,
                    data.location.y,
                    (Math.random() - 0.5) * 20,
                    (Math.random() * -30),
                    0, 0,
                    now);
                var mover: Mover = new Mover(p);
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
                var view:IView = new RectangleView2(()=> { return {
                    x: p.location.x,
                    y: p.location.y,
                    width: 3,
                    height: 3,
                };});
                return new SingleGameObject<ParticleData>(p, [mover, gravity], [view]);
            });
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [generator, remover], [], pField);

        var flash = ExplosionController.createFlash(new LocatedData(new Coordinate(0,0)));
        return new ExplosionController(field, flash);
    }

    static createSpaceExplosion(data: ILocatedMoving): ExplosionController {
        let fieldData: ParticleFieldData = new ParticleFieldData(50, undefined, 5, 0.2, false);
        let pField: SingleGameObject<ParticleData>[] = [];
        var generator: ParticleGenerator = new ParticleGenerator(fieldData, pField, (now: number) => {
            var p = new ParticleData(data.location.x,
                data.location.y,
                data.velX + ((Math.random() - 0.5) * 20),
                data.velY + ((Math.random() - 0.5) * 20),
                0,
                0,
                now);
            var mover = new Mover(p);
            var view: IView = new RectangleView2(()=> { return {
                x: p.location.x,
                y: p.location.y,
                width: 3,
                height: 3,
            };});
            return new SingleGameObject<ParticleData>(p, [mover], [view]);
        });
        var remover: ParticleRemover = new ParticleRemover(fieldData, pField);
        var field = new MultiGameObject(fieldData, [generator, remover], [], pField);

        var flash = ExplosionController.createFlash(new LocatedData(new Coordinate(0, 0)));
        return new ExplosionController(field, flash);
    }
}
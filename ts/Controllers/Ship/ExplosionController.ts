import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocated, ILocatedMoving, LocatedData } from "ts/Data/PhysicsData";
import { IAcceleratorInputs, IAcceleratorOutputs, Accelerator } from "ts/Actors/Accelerator";
import { Mover } from "ts/Actors/Movers";
import { Flasher } from "ts/Actors/Switches";
import { IActor } from "ts/Actors/Actor";
import { ShapeData } from "ts/Data/ShapeData";
import { EffectData } from "ts/Data/EffectData";
import { IParticleGenInputs } from "ts/Actors/ParticleFieldUpdater";
import { SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field, IParticle } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
import { RectangleView } from "ts/Views/PolyViews";
import { ScreenFlashView } from "ts/Views/EffectViews";
import { IGameObject, ComponentObjects } from "ts/GameObjects/GameObject";
import { IView } from "../../Views/View";

// a controller has a specific interface (e.g. on/off) so change the state of its game objects
// it is also a game object.

export interface IExplosionController extends IGameObject {
    field: IGameObject;
    screenFlash: SingleGameObject<EffectData>;

    on(): void;
    off(): void;
}

export class ExplosionController extends ComponentObjects<IGameObject> implements IExplosionController  {
    explosionSound: AudioObject = new AudioObject("res/sound/explosion.wav");
    soundPlayed: boolean = false;

    constructor(public field: IGameObject,
        public fieldSwitcher: (on:boolean)=>void,
        public screenFlash: SingleGameObject<EffectData>) {
        super([field, screenFlash]);
    }

    on(): void {
        this.fieldSwitcher(true);
        this.screenFlash.model.enabled = true;
        if (!this.soundPlayed) {
            this.explosionSound.play();
            this.soundPlayed = true;
        }
    }

    off(): void {
        this.fieldSwitcher(false);
        this.screenFlash.model.enabled = false;
        this.explosionSound.pause();
        this.soundPlayed = false;
    }

    // flash and field separate?
    static createFlash(located:ILocated): SingleGameObject<EffectData> {
        let e: EffectData = new EffectData();
        let s: IActor = new Flasher(e);
        let flash: SingleGameObject<EffectData> = new SingleGameObject<EffectData>(e, [s], [new ScreenFlashView(located, e)]);
        return flash;
    }


    static createExplosion(data: ILocatedMoving, gravityOn: boolean): ExplosionController {
        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            Field.createExplosion(() => { return {
                x: data.location.x,
                y: data.location.y,
                gravityOn: gravityOn,
            };});
        var flash: SingleGameObject<EffectData> = ExplosionController.createFlash(new LocatedData(new Coordinate(0,0)));
        return new ExplosionController(field, (on:boolean)=> {
            field.model.on = on;
        }, flash);
    }

}
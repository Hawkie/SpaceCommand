import { Coordinate, Vector, ICoordinate } from "ts/Physics/Common";
import { ILocated, ILocatedMoving, LocatedData } from "ts/Data/PhysicsData";
import { IAcceleratorInputs, IAcceleratorOutputs, Accelerator } from "ts/Actors/Accelerator";
import { Mover } from "ts/Actors/Movers";
import { Flasher } from "ts/Actors/Switches";
import { IActor } from "ts/Actors/Actor";
import { ShapeData } from "ts/Data/ShapeData";
import { IParticleGenInputs } from "ts/Actors/ParticleFieldUpdater";
import { SingleGameObject, MultiGameObject } from "ts/GameObjects/GameObject";
import { Field, IParticle } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";
import { RectangleView } from "ts/Views/PolyViews";
import { ScreenFlashView, IFlashInputs } from "ts/Views/EffectViews";
import { IGameObject, ComponentObjects } from "ts/GameObjects/GameObject";
import { IView } from "../../Views/View";

// a controller has a specific interface (e.g. on/off) so change the state of its game objects
// it is also a game object.

export interface IExplosionController extends IGameObject {
    field: IGameObject;
    screenFlash: SingleGameObject<IFlashInputs>;

    on(): void;
    off(): void;
}

export class ExplosionController extends ComponentObjects<IGameObject> implements IExplosionController  {
    explosionSound: AudioObject = new AudioObject("res/sound/explosion.wav");
    soundPlayed: boolean = false;

    constructor(public field: IGameObject,
        public fieldSwitcher: (on:boolean)=>void,
        public screenFlash: SingleGameObject<IFlashInputs>) {
        super([field, screenFlash]);
    }

    on(): void {
        this.fieldSwitcher(true);
        this.screenFlash.model.on = true;
        if (!this.soundPlayed) {
            this.explosionSound.play();
            this.soundPlayed = true;
        }
    }

    off(): void {
        this.fieldSwitcher(false);
        this.screenFlash.model.on = false;
        this.explosionSound.pause();
        this.soundPlayed = false;
    }

    // flash and field separate?
    static createFlash(): SingleGameObject<IFlashInputs> {
        let flashIn: IFlashInputs = {
            on: false,
            value: 0,
            x:0,
            y:0,
            width: 512,
            height: 480,
        };
        let flasher: IActor = new Flasher(() => { return {
                enabled: flashIn.on,
                value: flashIn.value,
                repeat: 10,
                speed: 1,
            };},
            (out:number)=> { flashIn.value = out;
            }
        );
        let flash: SingleGameObject<IFlashInputs> = new SingleGameObject<IFlashInputs>(flashIn,
            [flasher], [new ScreenFlashView(()=> flashIn)]);
        return flash;
    }


    static createExplosion(data: ILocatedMoving, gravityOn: boolean): ExplosionController {
        var field: MultiGameObject<IParticleGenInputs,SingleGameObject<IParticle>> =
            Field.createExplosion(() => { return {
                x: data.location.x,
                y: data.location.y,
                gravityOn: gravityOn,
            };});
        var flash: SingleGameObject<IFlashInputs> = ExplosionController.createFlash();
        return new ExplosionController(field, (on:boolean)=> {
            field.model.on = on;
        }, flash);
    }

}
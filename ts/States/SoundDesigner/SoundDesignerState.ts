import { DrawContext} from "ts/Common/DrawContext";
import { SoundEffectData, SoundEffectsModel } from "ts/States/SoundDesigner/SoundEffectsModel";
import { FXObject } from "ts/Sound/FXObject";
import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate } from "ts/Physics/Common";
import { ControlPanel } from "ts/GameObjects/ControlPanel";
import { Slider } from "ts/Models/Controls/ControlPanelModel";
import { TextData } from "ts/Data/TextData";
import { IGameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/TextObject";
import { IGameState, GameState } from "ts/States/GameState";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";


export class SoundDesignerState extends GameState {

    lastMoved: number;
    exitState: boolean = false;

    static create(): IGameState {
        var text: IGameObject = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: IGameObject[] = [text];

        var sfxModel = new SoundEffectsModel();
        var controls: ControlPanel<SoundEffectsModel> = new ControlPanel<SoundEffectsModel>(sfxModel, new Coordinate(10, 50));

        return new SoundDesignerState("Sound Designer", objects, controls);
    }

    constructor(public name: string, private objects: IGameObject[], private controls: ControlPanel<SoundEffectsModel>, private playedSound:boolean = true) {
        super(name);
        this.lastMoved = Date.now();
    }

    update(timeModifier: number) {
        this.objects.forEach(o => o.update(timeModifier));
    }

    display(drawContext: DrawContext) {
        drawContext.clear();
        this.objects.forEach(o => o.display(drawContext));
        this.controls.display(drawContext);
    }

    sound(actx: AudioContext) {
        if (!this.playedSound) {
            var sound: FXObject = new FXObject(actx, this.controls.model.sfxData);
            sound.play();
            //sctx.sound.playWithData(this.controls.model.sfxData);
            this.playedSound = true;
        }
    }

    tests() { }

    input(keyStateProvider: KeyStateProvider, lastDrawModifier: number) {
        var now: number = Date.now();
        if ((now - this.lastMoved) > 150) {
            this.lastMoved = now;
            if (keyStateProvider.isKeyDown(Keys.UpArrow)) { this.controls.model.onPreviousSelection(); }
            if (keyStateProvider.isKeyDown(Keys.DownArrow)) { this.controls.model.onNextSelection(); }
            if (keyStateProvider.isKeyDown(Keys.LeftArrow)) { this.controls.model.onDecrease(); }
            if (keyStateProvider.isKeyDown(Keys.RightArrow)) { this.controls.model.onIncrease(); }
            if (keyStateProvider.isKeyDown(Keys.Enter)) {
                this.controls.model.onToggle();
            }
            if (keyStateProvider.isKeyDown(Keys.SpaceBar)) { this.playedSound = false; }
            if (keyStateProvider.isKeyDown(Keys.Esc)) this.exitState = true;
        }
    }

    returnState(): number {
        let s = undefined;
        if (this.exitState) {
            this.exitState = false;
            s = 0;
        }
        return s;
    }
}
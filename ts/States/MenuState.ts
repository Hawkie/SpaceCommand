import { DrawContext} from "ts/Common/DrawContext";
import { AudioObject, AudioWithAmplifier  } from "ts/Sound/SoundObject";
import { Amplifier } from "ts/Sound/Amplifier";
import { SoundEffectData } from "ts/States/SoundDesigner/SoundEffectsModel";
import { Assets } from "ts/Resources/Assets";
import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";
import { IGameState } from "ts/States/GameState";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";
import { AsteroidFields } from "ts/States/Asteroids/AsteroidFields";
import { TextView } from "ts/gamelib/Views/TextView";
import { IView } from "ts/gamelib/Views/View";

function createMenuItem(name: string, x: number, y: number): SingleGameObject<string> {
    var menuObject: SingleGameObject<string> = new SingleGameObject<string>(()=>name,
    [],
    [new TextView(()=>name, new Coordinate(x, y), this.font, this.size)]);
    return menuObject;
}

export class MenuState implements IGameState {

    originalItems: string[] = [];
    font: string = "Arial";
    size: number = 16;
    selectedItem: number = 0;
    selected: boolean = false;
    lastMoved: number = Date.now();
    musicObject: AudioObject;

    private playingMusic: boolean = false;
    private assetsLoaded: boolean = false;

    static create(assets: Assets, actx:AudioContext): MenuState {
        // var field1 = new AsteroidFields('img/star.png', 512, 200, 32, 1);

        var field1: IGameObject = AsteroidFields.createBackgroundField(16, 1);
        var field2: IGameObject = AsteroidFields.createBackgroundField(32, 2);

        var title: IView = new TextView(()=>"SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        // let items: MenuItem[] = [new MenuItem("Asteroids", 1), new MenuItem("Landing", 2),
        // new MenuItem("Land Explorer", 3), new MenuItem("Two Player Duel", 4), new MenuItem("Sound Designer", 5)];
        let items: string[] = ["Asteroids"];
        return new MenuState("Menu", assets, actx, [title], [field1, field2], items);
    }

    constructor(public name: string,
        private assets: Assets,
        private actx:AudioContext,
        private views: IView[],
        private objects : IGameObject[],
        private items : string[]) {
        let x: number = 200;
        let y: number = 100;


        for (let i:number=0;i<items.length;i++) {
            this.originalItems.push(items[i]);
            this.views.push(new TextView(()=>items[i], new Coordinate(x, y), this.font, this.size));
            y += 50;
        }
        this.musicObject = new AudioObject("res/sound/TimePortal.mp3", true);
    }

    update(lastDrawModifier: number): void {
        this.objects.forEach(object => object.update(lastDrawModifier));

        for (let i: number = 0; i < this.items.length; i++) {
            if (i === this.selectedItem) {
                this.items[i] = "<" + this.originalItems[i] + ">";
            } else {
                this.items[i] = " " + this.originalItems[i] + " ";
            }
        }
    }

    display(drawingContext: DrawContext): void {
        drawingContext.clear();
        this.views.forEach(v=> v.display(drawingContext));
        this.objects.forEach(object => object.display(drawingContext));

    }

    sound(actx: AudioContext): void {
        // load assets
        // if (this.loadAssets) {
        //    this.loadAssets = false;
        //    this.assets.load(this.actx, ["res/sound/TimePortal.mp3"], () => {
        //        sctx.playSound(this.assets.soundData[0].data);
        //    });
        //    console.log("Waiting for resources to load");
        // }
        if (!this.playingMusic) {
            this.playingMusic = true;
            this.musicObject.play();
        }
    }

    input(keys: KeyStateProvider, lastDrawModifier: number): void {
        var now: number = Date.now();
        if ((now - this.lastMoved) > 150) {
            this.lastMoved = now;
            if (keys.isKeyDown(Keys.UpArrow)) {
                this.selectedItem -= 1;
            }
            if (keys.isKeyDown(Keys.DownArrow)) {
                this.selectedItem += 1;
            }
            if (this.selectedItem < 0) {
                this.selectedItem = 0;
            }
            if (this.selectedItem >= this.items.length) {
                this.selectedItem = this.items.length - 1;
            }
            if (keys.isKeyDown(Keys.Enter)) {
                this.selected = true;
            }
        }
    }

    tests(lastTestModifier: number): void {
        //
    }

    returnState(): number {
        let newState:number = undefined;
        if (this.selected) {
            this.selected = false;
            newState = this.selectedItem+1;
        }
        return newState;
    }
}

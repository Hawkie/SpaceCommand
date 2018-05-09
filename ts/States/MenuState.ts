import { DrawContext} from "ts/gamelib/Common/DrawContext";
import { AudioObject, AudioWithAmplifier  } from "ts/Sound/SoundObject";
import { Amplifier } from "ts/Sound/Amplifier";
import { SoundEffectData } from "ts/States/SoundDesigner/SoundEffectsModel";
import { Assets } from "ts/Resources/Assets";
import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IGameObject, SingleGameObject, MultiGameObject } from "ts/gamelib/GameObjects/GameObject";
import { IGameState } from "ts/States/GameState";
import { Keys, KeyStateProvider } from "ts/gamelib/Common/KeyStateProvider";
import { AsteroidFields } from "ts/States/Asteroids/AsteroidFields";
import { TextView } from "ts/gamelib/Views/TextView";
import { IView } from "ts/gamelib/Views/View";
import { Sound } from "ts/gamelib/Actors/Sound";
import { IActor } from "ts/gamelib/Actors/Actor";

// function createMenuItem(name: string, x: number, y: number): SingleGameObject {
//     var menuObject: SingleGameObject = new SingleGameObject([],
//     [new TextView(()=>name, new Coordinate(x, y), this.font, this.size)]);
//     return menuObject;
// }
interface IMenuState {
    musicFilename: string;
    title: string;
    font: string;
    fontSize: number;
    menuItems: string[];
    originalItems: string[];
}

function createMenuState(): IMenuState {
    return {
        musicFilename: "res/sound/TimePortal.mp3",
        title: "Menu",
        font: "Arial",
        fontSize: 18,
        menuItems: ["Asteroids"],
        originalItems: [],
    };
}

function createMenuObj(getState: ()=>IMenuState): IGameObject {
    var state: IMenuState = getState();
    var sound: Sound = new Sound(state.musicFilename, false, true, ()=> { return { play: true};});
    var field1: IGameObject = AsteroidFields.createBackgroundField(16, 1);
    var field2: IGameObject = AsteroidFields.createBackgroundField(32, 2);

    var title: IView = new TextView(()=>state.title, new Coordinate(10, 20), "Arial", 18);
    var gameObject: IGameObject = new MultiGameObject<SingleGameObject>([sound], [title], ()=> [field1, field2]);

    let x: number = 200;
    let y: number = 100;
    for (let i:number=0;i<state.menuItems.length;i++) {
        state.originalItems.push(state.menuItems[i]);
        gameObject.views.push(new TextView(()=>state.menuItems[i], new Coordinate(x, y), state.font, state.fontSize));
        y += 50;
    }
    return gameObject;
}

export function createMenu(assets: Assets, actx:AudioContext): MenuState {
    // var field1 = new AsteroidFields('img/star.png', 512, 200, 32, 1);
    var state: IMenuState = createMenuState();
    var gameObject: IGameObject = createMenuObj(()=>state);
        // let items: MenuItem[] = [new MenuItem("Asteroids", 1), new MenuItem("Landing", 2),
    // new MenuItem("Land Explorer", 3), new MenuItem("Two Player Duel", 4), new MenuItem("Sound Designer", 5)];
    return new MenuState("Menu", assets, state, gameObject);
}


// function createMenuObjects(): IMenuObjects {
//     //
// }

export class MenuState implements IGameState {

    selectedItem: number = 0;
    selected: boolean = false;
    lastMoved: number = Date.now();

    private playingMusic: boolean = false;
    private assetsLoaded: boolean = false;

    constructor(public name: string,
        private assets: Assets,
        private state: IMenuState,
        private object: IGameObject) {
    }

    update(lastDrawModifier: number): void {
        this.object.update(lastDrawModifier);

        for (let i: number = 0; i < this.state.menuItems.length; i++) {
            if (i === this.selectedItem) {
                this.state.menuItems[i] = "<" + this.state.originalItems[i] + ">";
            } else {
                this.state.menuItems[i] = " " + this.state.originalItems[i] + " ";
            }
        }
    }

    display(drawingContext: DrawContext): void {
        drawingContext.clear();
        this.object.display(drawingContext);

    }

    sound(actx: AudioContext): void {
      //
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
            if (this.selectedItem >= this.state.menuItems.length) {
                this.selectedItem = this.state.menuItems.length - 1;
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

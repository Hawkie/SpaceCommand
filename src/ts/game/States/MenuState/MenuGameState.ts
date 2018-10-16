import { DrawContext} from "ts/gamelib/1Common/DrawContext";
import { AudioObject, AudioWithAmplifier  } from "ts/Sound/SoundObject";
import { Amplifier } from "ts/Sound/Amplifier";
import { Assets } from "ts/gamelib/1Common/Assets";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { IGameState } from "ts/gamelib/GameState/GameState";
import { Keys, KeyStateProvider } from "ts/gamelib/1Common/KeyStateProvider";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IParticleField } from "../Asteroids/createAsteroidData";
import { AsteroidGameState } from "../Asteroids/AsteroidGameState";
import { LandExplorerGameState } from "../LandExplorer/LandExplorerGameState";
import { createMenuData, IMenuData } from "./createMenuData";
import { createMenuStateObjects } from "./createMenuStateObjects";


export function createMenuState(assets: Assets, actx:AudioContext): MenuState {
    // var field1 = new AsteroidFields('img/star.png', 512, 200, 32, 1);
    var menuData: IMenuData = createMenuData();
    var gameObject: IGameObject = createMenuStateObjects(()=>menuData);
        // let items: MenuItem[] = [new MenuItem("Asteroids", 1), new MenuItem("Landing", 2),
    // new MenuItem("Land Explorer", 3), new MenuItem("Two Player Duel", 4), new MenuItem("Sound Designer", 5)];
    return new MenuState("Menu", assets, menuData, gameObject);
}

export class MenuState implements IGameState {

    selectedItem: number = 0;
    selected: boolean = false;
    lastMoved: number = Date.now();

    private playingMusic: boolean = false;
    private assetsLoaded: boolean = false;

    constructor(public name: string,
        private assets: Assets,
        private state: IMenuData,
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

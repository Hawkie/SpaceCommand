import { DrawContext} from "../../../gamelib/1Common/DrawContext";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { IGameState } from "../../../gamelib/GameState/GameState";
import { Keys, KeyStateProvider } from "../../../gamelib/1Common/KeyStateProvider";
import { createMenuData, IMenuData } from "./createMenuData";
import { createMenuStateObjects } from "./createMenuStateObjects";

// when creating a game state - create the data and then bind to the objects
export function createMenuState(): MenuState {
    // let field1 = new AsteroidFields('img/star.png', 512, 200, 32, 1);
    let menuData: IMenuData = createMenuData();
    let gameObject: IGameObject = createMenuStateObjects(()=>menuData);
        // let items: MenuItem[] = [new MenuItem("Asteroids", 1), new MenuItem("Landing", 2),
    // new MenuItem("Land Explorer", 3), new MenuItem("Two Player Duel", 4), new MenuItem("Sound Designer", 5)];
    return new MenuState("Menu", ()=>menuData, ()=>gameObject);
}


export class MenuState implements IGameState {

    selectedItem: number = 0;
    selected: boolean = false;
    lastMoved: number = Date.now();

    private playingMusic: boolean = false;
    private assetsLoaded: boolean = false;

    constructor(public name: string,
        private menuDataCallback: ()=>IMenuData,
        private objectCallback: ()=>IGameObject) {
    }

    update(lastDrawModifier: number): void {
        this.objectCallback().update(lastDrawModifier);
        const menuData: IMenuData = this.menuDataCallback();
        for (let i: number = 0; i < menuData.menuItems.length; i++) {
            if (i === this.selectedItem) {
                menuData.menuItems[i] = "<" + menuData.originalItems[i] + ">";
            } else {
                menuData.menuItems[i] = " " + menuData.originalItems[i] + " ";
            }
        }
    }

    display(drawingContext: DrawContext): void {
        drawingContext.clear();
        this.objectCallback().display(drawingContext);

    }

    sound(actx: AudioContext): void {
      //
    }

    input(keys: KeyStateProvider, lastDrawModifier: number): void {
        let now: number = Date.now();
        const menuData: IMenuData = this.menuDataCallback();
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
            if (this.selectedItem >= menuData.menuItems.length) {
                this.selectedItem = menuData.menuItems.length - 1;
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

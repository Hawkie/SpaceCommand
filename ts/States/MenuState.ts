import { DrawContext} from "../Common/DrawContext";
import { IGameObject, StaticGameObject, MovingGameObject } from "../Common/GameObject";
import { BasicShip } from "../Ships/Ship";
import { SparseArray } from "../Collections/SparseArray";
import { DotField } from "../Space/DotField";
import { Coordinate } from "../Common/Coordinate";
import { GuiText } from "../Gui/GuiText";
import { Asteroid } from "../Space/Asteroid";
import { IGameState } from "GameState";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";

export class MenuState implements IGameState {

    menuItems: SparseArray<GuiText> = new SparseArray<GuiText>(10);
    font: string = "Arial";
    size: number = 16;
    selectedItem: number = 0;
    objects: Array<IGameObject>;
    states: Array<IGameState>;
    selectedState: IGameState = null;

    constructor(private textItems: Array<string>, objects : Array<IGameObject>, states : Array<IGameState>) {
        let x: number = 200;
        let y: number = 100;

        textItems.forEach(text => {
            this.menuItems.add(new GuiText(text, new Coordinate(x, y), this.font, this.size));
            y += 50;
        });
        this.objects = objects;
        this.states = states;
    }

    update(lastDrawModifier: number) {
        this.objects.forEach(object => object.update(lastDrawModifier));
    }

    display(drawingContext: DrawContext) {
        drawingContext.clear();
        this.objects.forEach(object => object.display(drawingContext));
        for (let i: number = 0; i < this.menuItems.length; i++) {
            let item = this.menuItems[i];
            if (i == this.selectedItem) {
                item.text = "<" + this.textItems[i] + ">";
            }
            else {
                item.text = " " + this.textItems[i] + " ";
            }
            item.display(drawingContext);
        }
        
    }

    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.selectedItem -= 1;
        if (keys.isKeyDown(Keys.DownArrow)) this.selectedItem += 1;
        if (this.selectedItem < 0) this.selectedItem = 0;
        if (this.selectedItem >= this.menuItems.length) this.selectedItem = this.menuItems.length - 1;
        if (keys.isKeyDown(Keys.Enter)) this.selectedState = this.states[this.selectedItem];
        
    }

    tests() { }

    returnState(): IGameState {
        return this.selectedState;
    }
}

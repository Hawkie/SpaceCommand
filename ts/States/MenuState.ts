import { DrawContext} from "../Common/DrawContext";
import { IGameObject } from "../GameObjects/GameObject";
import { TextObject, ParticleField, Asteroid } from "../GameObjects/SpaceObject";
import { SparseArray } from "../Collections/SparseArray";
import { Coordinate } from "../Physics/Common";
import { TextModel } from "../Models/TextModel";
import { IParticleModel, IParticleFieldModel, ParticleModel, ParticleFieldModel } from "../Models/ParticleFieldModel";
import { IGameState } from "GameState";
import { Keys, KeyStateProvider } from "../Common/KeyStateProvider";

export class MenuState implements IGameState {

    menuItems: SparseArray<TextObject> = new SparseArray<TextObject>(10);
    font: string = "Arial";
    size: number = 16;
    selectedItem: number = 0;
    objects: Array<IGameObject>;
    states: Array<IGameState>;
    selectedState: IGameState = null

    static create(states: Array<IGameState>): MenuState {
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var fModel1: IParticleFieldModel = new ParticleFieldModel(1);
        var field1 = new ParticleField(fModel1,
                () => { return 512 * Math.random(); },
                () => { return 0; },
                () => { return 0; },
                () => { return 16; }, 2, 2);
        var fModel2: IParticleFieldModel = new ParticleFieldModel(1);
        var field2 = new ParticleField(fModel2,
            () => { return 512 * Math.random(); },
            () => { return 0; },
            () => { return 0; },
            () => { return 32; }, 2, 2);
        
        var text: IGameObject = new TextObject("SpaceCommander", new Coordinate(10, 20), "Arial", 18);
        var objects: Array<IGameObject> = [field1, field2, text];

        return new MenuState("Menu", objects, states);
    }

    constructor(public name: string, objects : Array<IGameObject>, states : Array<IGameState>) {
        let x: number = 200;
        let y: number = 100;

        states.forEach(state => {
            this.menuItems.add(new TextObject(state.name, new Coordinate(x, y), this.font, this.size));
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
                item.model.text = "<" + this.states[i].name + ">";
            }
            else {
                item.model.text = " " + this.states[i].name + " ";
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

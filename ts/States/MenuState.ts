import { DrawContext} from "ts/Common/DrawContext";
import { SoundContext } from "ts/Sound/SoundContext";

import { SparseArray } from "ts/Collections/SparseArray";
import { Coordinate } from "ts/Physics/Common";
import { TextData } from "ts/Models/TextModel";
import { IParticleData, IParticleFieldData, ParticleData, ParticleFieldData, MovingParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { IGameState } from "ts/States/GameState";
import { Keys, KeyStateProvider } from "ts/Common/KeyStateProvider";

import { IGameObject } from "ts/GameObjects/GameObject";
import { Asteroid } from "ts/GameObjects/Space/SpaceObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";
import { ParticleField } from "ts/GameObjects/Common/ParticleField";

export class MenuState implements IGameState {

    menuItems: SparseArray<TextObject> = new SparseArray<TextObject>(10);
    font: string = "Arial";
    size: number = 16;
    selectedItem: number = 0;
    objects: Array<IGameObject>;
    states: Array<IGameState>;
    selectedState: IGameState = null;


    static create(states: Array<IGameState>): MenuState {
        //var field1 = new ParticleField('img/star.png', 512, 200, 32, 1);
        var fData1: IParticleFieldData = new ParticleFieldData(1);
        var fModel1: ParticleFieldModel = new ParticleFieldModel(fData1,
            (now: number) => new MovingParticleModel(new ParticleData(512 * Math.random(), 0, 0, 16, now)));
        var field1 = new ParticleField(fModel1, 1, 1);
        var fData2: IParticleFieldData = new ParticleFieldData(1);
        var fModel2: ParticleFieldModel = new ParticleFieldModel(fData2,
            (now: number) => new MovingParticleModel(new ParticleData(512 * Math.random(), 0, 0, 32, now)));
        var field2 = new ParticleField(fModel2, 2, 2);
        
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
                item.model.data.text = "<" + this.states[i].name + ">";
            }
            else {
                item.model.data.text = " " + this.states[i].name + " ";
            }
            item.display(drawingContext);
        }
    }

    sound(sctx: SoundContext) {
        
    }

    input(keys: KeyStateProvider, lastDrawModifier: number) {
        if (keys.isKeyDown(Keys.UpArrow)) this.selectedItem -= 1;
        if (keys.isKeyDown(Keys.DownArrow)) this.selectedItem += 1;
        if (this.selectedItem < 0) this.selectedItem = 0;
        if (this.selectedItem >= this.menuItems.length) this.selectedItem = this.menuItems.length - 1;
        if (keys.isKeyDown(Keys.Enter)) this.selectedState = this.states[this.selectedItem];
        
    }

    tests(lastTestModifier: number) { }

    returnState(): IGameState {
        return this.selectedState;
    }
}

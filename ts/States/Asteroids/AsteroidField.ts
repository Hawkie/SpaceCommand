import { SingleGameObject, IGameObject } from "../../GameObjects/GameObject";
import { ISyncedArray } from "./AsteroidModels";
import { IActor } from "../../gamelib/Actors/Actor";

interface IArrayAmendments<T> {

    oldItems: number[];
    newItems: T[];
}

export class Syncer<T> implements IActor {
    constructor(private get: ()=>IArrayAmendments<T>,
    private items: SingleGameObject<T>[],
    private createObject: (t: T)=> SingleGameObject<T>) {}
    update(timeModifier: number): void {
        // var inputs: IArrayAmendments<T> =  this.get();
        ArrayAmender<T>(this.get, this.items, this.createObject);
    }
}

export function ArrayAmender<T>(getInputs: ()=> IArrayAmendments<T>,
    items: SingleGameObject<T>[],
    createObject: (t: T)=> SingleGameObject<T>): void {

        var inputs:IArrayAmendments<T> = getInputs();
        inputs.newItems.forEach(element => {
            var aObj:SingleGameObject<T> = createObject(element);
            items.push(aObj);
        });
        inputs.newItems = [];
        inputs.oldItems.sort().reverse().forEach((i)=> {
            items.splice(i,1);
        });
        inputs.oldItems = [];
}
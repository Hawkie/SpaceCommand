import { SingleGameObject, IGameObject } from "ts/gamelib/GameObjects/GameObject";
import { IActor } from "ts/gamelib/Actors/Actor";

interface IArrayAmendments<T> {

    oldItems: number[];
    newItems: T[];
}

export class Syncer<T> implements IActor {
    constructor(private get: ()=>IArrayAmendments<T>,
    private items: SingleGameObject[],
    private createObject: (t: T)=> SingleGameObject) {}
    update(timeModifier: number): void {
        // var inputs: IArrayAmendments<T> =  this.get();
        ArrayAmender<T>(this.get, this.items, this.createObject);
    }
}

export function ArrayAmender<T>(getInputs: ()=> IArrayAmendments<T>,
    items: SingleGameObject[],
    createObject: (t: T)=> SingleGameObject): void {

        var inputs:IArrayAmendments<T> = getInputs();
        inputs.newItems.forEach(element => {
            var aObj:SingleGameObject = createObject(element);
            items.push(aObj);
        });
        inputs.newItems = [];
        inputs.oldItems.sort().reverse().forEach((i)=> {
            items.splice(i,1);
        });
        inputs.oldItems = [];
}
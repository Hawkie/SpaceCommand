import { SingleGameObject, IGameObject } from "../../GameObjects/GameObject";

interface IArrayAmendments<T> {

    remove: number[];
    add: T[];
    existing: SingleGameObject<T>[];
}

export function ArrayAmender<T>(getInputs: ()=> IArrayAmendments<T>, createObject: (t: T)=> SingleGameObject<T>): void {

        var inputs:IArrayAmendments<T> = getInputs();
        inputs.add.forEach(element => {
            var aObj:SingleGameObject<T> = createObject(element);
            inputs.existing.push(aObj);
        });
        inputs.add = [];
        inputs.remove.sort().reverse().forEach((i)=> {
            inputs.existing.splice(i,1);
        });
        inputs.remove = [];
}
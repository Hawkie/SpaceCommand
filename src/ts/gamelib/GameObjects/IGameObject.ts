import { IActor } from "ts/gamelib/Actors/Actor";
import { IView } from "ts/gamelib/Views/View";

export interface IGameObject extends IActor, IView {
    actors: IActor[];
    views: IView[];
}




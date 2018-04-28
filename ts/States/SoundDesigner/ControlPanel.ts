import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

import { ControlPanelView } from "ts/gamelib/Views/ControlPanelView";
import { IControlPanelModel, ControlPanelModel } from "ts/Models/Controls/ControlPanelModel";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";



export class ControlPanel<TModel extends IControlPanelModel> extends SingleGameObject<TModel> {
    constructor(model: ()=>TModel, location: ICoordinate) {
        var view: ControlPanelView = new ControlPanelView(model, location, 200);
        super(model, [], [view]);
    }
}
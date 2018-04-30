import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

import { ControlPanelView } from "ts/gamelib/Views/ControlPanelView";
import { IControlPanelModel, ControlPanelModel } from "ts/Models/Controls/ControlPanelModel";
import { Coordinate, ICoordinate } from "ts/gamelib/Data/Coordinate";



export class ControlPanel<TModel extends IControlPanelModel> extends SingleGameObject {
    constructor(private model: ()=>TModel, location: ICoordinate) {
        super([], []);
        var view: ControlPanelView = new ControlPanelView(model, location, 200);
        this.views.push(view);

    }
}
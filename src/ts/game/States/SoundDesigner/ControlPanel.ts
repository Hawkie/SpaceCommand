import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";

import { ControlPanelView } from "../../../gamelib/Views/ControlPanelView";
import { IControlPanelModel, ControlPanelModel } from "ts/Models/Controls/ControlPanelModel";
import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";



export class ControlPanel<TModel extends IControlPanelModel> extends SingleGameObject {
    constructor(private model: ()=>TModel, location: ICoordinate) {
        super([], []);
        let view: ControlPanelView = new ControlPanelView(model, location, 200);
        this.views.push(view);

    }
}
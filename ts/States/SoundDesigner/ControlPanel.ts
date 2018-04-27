﻿import { IGameObject, SingleGameObject } from "ts/GameObjects/GameObject";

import { ControlPanelView } from "ts/Views/ControlPanelView";
import { IControlPanelModel, ControlPanelModel } from "ts/Models/Controls/ControlPanelModel";
import { Coordinate, Vector } from "ts/Physics/Common";



export class ControlPanel<TModel extends IControlPanelModel> extends SingleGameObject<TModel> {
    constructor(model: ()=>TModel, location: Coordinate) {
        var view: ControlPanelView = new ControlPanelView(model, location, 200);
        super(model, [], [view]);
    }
}
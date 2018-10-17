import { Coordinate } from "ts/gamelib/DataTypes/Coordinate";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { TextView } from "ts/gamelib/Views/TextView";
import { IView } from "ts/gamelib/Views/View";
import { Sound } from "ts/gamelib/Actors/Sound";
import { createBackgroundField } from "../../Objects/Particle/createBackgroundField";
import { IMenuData } from "./createMenuData";

export function createMenuStateObjects(getData: () => IMenuData): IGameObject {
    var data: IMenuData = getData();
    var sound: Sound = new Sound(data.musicFilename, false, true, () => { return { play: true }; });
    var field1: IGameObject = createBackgroundField(() => data.starField1, 16);
    var field2: IGameObject = createBackgroundField(() => data.starField2, 32);
    var title: IView = new TextView(() => data.title, new Coordinate(10, 20), "Arial", 18);
    var gameObject: IGameObject = new MultiGameObject<SingleGameObject>([sound], [title], () => [field1, field2]);
    let x: number = 200;
    let y: number = 100;

    // todo: crude for loop
    for (let i: number = 0; i < data.menuItems.length; i++) {
        data.originalItems.push(data.menuItems[i]);
        gameObject.views.push(new TextView(() => data.menuItems[i], new Coordinate(x, y), data.font, data.fontSize));
        y += 50;
    }
    return gameObject;
}
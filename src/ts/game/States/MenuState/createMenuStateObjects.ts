import { Coordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IGameObject } from "../../../gamelib/GameObjects/IGameObject";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { TextView } from "../../../gamelib/Views/TextView";
import { IView } from "../../../gamelib/Views/View";
import { Sound } from "../../../../../src/ts/gamelib/Actors/Sound";
import { createBackgroundField } from "../../Objects/Particle/createBackgroundField";
import { IMenuData } from "./createMenuData";

export function createMenuStateObjects(getData: () => IMenuData): IGameObject {
    let data: IMenuData = getData();
    let sound: Sound = new Sound(data.musicFilename, false, true, () => { return { play: true }; });
    let field1: IGameObject = createBackgroundField(() => data.starField1, 16);
    let field2: IGameObject = createBackgroundField(() => data.starField2, 32);
    let title: IView = new TextView(() => data.title, new Coordinate(10, 20), "Arial", 18);
    let gameObject: IGameObject = new MultiGameObject<SingleGameObject>([sound], [title], () => [field1, field2]);
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
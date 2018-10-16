import { IGraphicShip } from "../../States/Asteroids/AsteroidModels";
import { IView } from "ts/gamelib/Views/View";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { GraphicAngledView } from "ts/gamelib/Views/GraphicView";

// creates a small graphic object in the shape of a ship
export function createGraphicShipObject(getGraphicShip: () => IGraphicShip): SingleGameObject {
    var graphicShip: IGraphicShip = getGraphicShip();
    var shipView: IView = new GraphicAngledView(() => {
        return {
            x: graphicShip.x,
            y: graphicShip.y,
            angle: graphicShip.angle,
            graphic: graphicShip.graphic,
        };
    });
    var obj: SingleGameObject = new SingleGameObject([], [shipView]);
    return obj;
}
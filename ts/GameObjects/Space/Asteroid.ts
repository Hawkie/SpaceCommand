
import { IView, PolyView, ParticleFieldView } from "ts/Views/PolyViews";
import { ShapedModel } from "ts/Models/DynamicModels";
import { IShape, ShapeData } from "ts/Data/ShapeData";
import { ILocatedMovingAngledRotatingData, LocatedMovingAngledRotatingData } from "ts/Data/PhysicsData"; 
import { IActor } from "ts/Actors/Actor";
import { Mover } from "ts/Actors/Movers";
import { Coordinate, Vector } from "ts/Physics/Common";
import { PolyRotator, Spinner } from "ts/Actors/Rotators";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Transforms } from "ts/Physics/Transforms";
import { IGameObject, GameObject } from "ts/GameObjects/GameObject";
import { TextObject } from "ts/GameObjects/Common/BaseObjects";

export class AsteroidModel extends ShapedModel<ILocatedMovingAngledRotatingData> { }

export class Asteroid extends GameObject<AsteroidModel> { }

export class AsteroidHelper {
    // 5 different asteroid shapes
    //  [-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
    // 	[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
    // 	[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
    // 	[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
    // 	[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
            //var rectangle1 = [new Coordinate(- 2, -20),
        //    new Coordinate(2, -20),
        //    new Coordinate(2, 20),
        //    new Coordinate(-2, 20),
        //    new Coordinate(-2, -20)];

    static createAsteroid(location: Coordinate, velX: number, velY: number, angle: number, spin: number): Asteroid {
        var asteroid1 = [new Coordinate(-4, -2),
            new Coordinate(-2, -4),
            new Coordinate(0, -2),
            new Coordinate(2, -4),
            new Coordinate(4, -2),
            new Coordinate(3, 0),
            new Coordinate(4, 2),
            new Coordinate(1, 3),
            new Coordinate(-2, 4),
            new Coordinate(-4, 2),
            new Coordinate(-4, -2),
        ];
        Transforms.scale(asteroid1, 2, 2);
        var shape: IShape = new ShapeData(asteroid1);
        var data = new LocatedMovingAngledRotatingData(location, velX, velY, angle, spin);
        var mover = new Mover(data);
        var spinner = new Spinner(data);

        var model = new ShapedModel<ILocatedMovingAngledRotatingData>(data, shape, [mover, spinner]);
        var view: PolyView = new PolyView(model.data, model.shape);
        var asteroidObject = new GameObject<ShapedModel<ILocatedMovingAngledRotatingData>>(model, [view]);
        return asteroidObject;
    }
}

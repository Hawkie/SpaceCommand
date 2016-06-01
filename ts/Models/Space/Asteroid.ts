import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ILocatedMovingAngledRotatingData, LocatedMovingAngledRotatingData, IHittable  } from "ts/Data/PhysicsData";
import { IShape, ShapeData  } from "ts/Data/ShapeData";
import { Mover } from "ts/Actors/Movers";
import { Spinner, PolyRotator } from "ts/Actors/Rotators";
import { DynamicModel, ShapedModel } from "ts/Models/DynamicModels";


export class AsteroidModel extends ShapedModel<ILocatedMovingAngledRotatingData> implements IHittable {
    constructor(location: Coordinate, velX:number, velY:number, angle:number, spin:number) {
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
        var rectangle1 = [new Coordinate(- 2, -20),
            new Coordinate(2, -20),
            new Coordinate(2, 20),
            new Coordinate(-2, 20),
            new Coordinate(-2, -20)];
        var shape: IShape = new ShapeData(asteroid1);
        var data = new LocatedMovingAngledRotatingData(location, velX, velY, angle, spin);
        var mover = new Mover(data);
        var spinner = new Spinner(data);
        super(data, shape, [mover, spinner]);
    }

    hit() {
        this.data.velX += 2;
        this.data.spin += 1;
    }
}
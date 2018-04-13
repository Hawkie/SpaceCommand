import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ILocatedMovingAngledRotating, LocatedMovingAngledRotatingData, IHittable  } from "ts/Data/PhysicsData";
import { IShape, ShapeData  } from "ts/Data/ShapeData";
import { PolyRotator } from "ts/Actors/Rotators";
import { ShapedModel } from "ts/Models/DynamicModels";


export class AsteroidModel extends ShapedModel<ILocatedMovingAngledRotating, IShape> implements IHittable {

    // 5 different asteroid shapes
    private static a1 = [-4, -2, -2, -4, 0, -2, 2, -4, 4, -2, 3, 0, 4, 2, 1, 4, -2, 4, -4, 2, -4, -2];
    private static a2 = [-3, 0, -4, -2, -2, -4, 0, -3, 2, -4, 4, -2, 2, -1, 4, 1, 2, 4, -1, 3, -2, 4, -4, 2, -3, 0];
    private static a3 = [-2, 0, -4, -1, -1, -4, 2, -4, 4, -1, 4, 1, 2, 4, 0, 4, 0, 1, -2, 4, -4, 1, -2, 0];
    private static a4 = [-1, -2, -2, -4, 1, -4, 4, -2, 4, -1, 1, 0, 4, 2, 2, 4, 1, 3, -2, 4, -4, 1, -4, -2, -1, -2];
    private static a5 = [-4, -2, -2, -4, 2, -4, 4, -2, 4, 2, 2, 4, -2, 4, -4, 2, -4, -2];
    static as = [AsteroidModel.a1, AsteroidModel.a2, AsteroidModel.a3, AsteroidModel.a4, AsteroidModel.a5];

    size: number;
    constructor(location: Coordinate, velX:number, velY:number, angle:number, spin:number, size:number, type:number) {
        var asteroid1 = AsteroidModel.as[type];
        var asteroidShape = Transforms.ArrayToPoints(asteroid1);

        Transforms.scale(asteroidShape, size, size);
        var shape: IShape = new ShapeData(asteroidShape);
        var data = new LocatedMovingAngledRotatingData(location, velX, velY, angle, spin);
        super(data, shape);
        this.size = size;
    }

    hit() {
        this.physics.velX += 2;
        this.physics.spin += 10;
    }
}
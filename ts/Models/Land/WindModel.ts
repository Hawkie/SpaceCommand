import { Coordinate } from "ts/Physics/Common";
import { ShapeLocatedModel } from "ts/Models/PolyModels";
import { ValueModel } from "ts/Models/TextModel";

export enum Direction {
    left,
    right
}



export class WindModel extends ShapeLocatedModel {
    pointsRight: Coordinate[];
    pointsLeft: Coordinate[];

    windStrength: ValueModel;
    windRightLeft: Direction;

    constructor(location: Coordinate, windStrength: number = 0, windRightLeft: Direction = Direction.right) {
        var pointsRight: Coordinate[] = [new Coordinate(-15, 10),
            new Coordinate(15, 10),
            new Coordinate(15, 20),
            new Coordinate(30, 0),
            new Coordinate(15, -20),
            new Coordinate(15, -10),
            new Coordinate(-15, -10),
            new Coordinate(-15, 10)];

        var pointsLeft: Coordinate[] = [new Coordinate(20, 10),
            new Coordinate(-10, 10),
            new Coordinate(-10, 20),
            new Coordinate(-25, 0),
            new Coordinate(-10, -20),
            new Coordinate(-10, -10),
            new Coordinate(20, -10),
            new Coordinate(20, 10)];

        super(pointsLeft, location);
        this.pointsRight = pointsRight;
        this.pointsLeft = pointsLeft;
        this.windRightLeft = windRightLeft;
        this.windStrength = new ValueModel(windStrength, new Coordinate(location.x, location.y));
    }

    updatePolygon() {
        if (this.windRightLeft == Direction.right)
            this.points = this.pointsRight;
        else
            this.points = this.pointsLeft;
    }
}
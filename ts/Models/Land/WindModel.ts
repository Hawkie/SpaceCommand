import { Coordinate } from "ts/Physics/Common";
import { ShapeLocatedData } from "ts/Models/PolyModels";
import { ValueData } from "ts/Models/TextModel";
import { DynamicModel } from "ts/Models/DynamicModels";
import { IActor } from "ts/Actors/Actor";
import { WindGenerator } from "ts/Actors/WindGenerator";

export enum Direction {
    left,
    right
}

export class WindData extends ShapeLocatedData {
    pointsRight: Coordinate[];
    pointsLeft: Coordinate[];

    windStrength: ValueData;
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
        this.windStrength = new ValueData(windStrength, new Coordinate(location.x, location.y));
    }

    updatePolygon() {
        if (this.windRightLeft == Direction.right)
            this.points = this.pointsRight;
        else
            this.points = this.pointsLeft;
    }
}

export class WindModel extends DynamicModel<WindData> {
    constructor(data: WindData) {
        var windGenerator:IActor = new WindGenerator(data);
        super(data, [windGenerator]);
    }
}
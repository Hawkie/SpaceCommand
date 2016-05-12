import { Coordinate } from "../Physics/Common";
import { ShapeLocatedModel } from "../Models/PolyModels";


export class WindDirectionIndicatorModel extends ShapeLocatedModel {
    pointsRight: Coordinate[];
    pointsLeft: Coordinate[];
    blowingRight: boolean;

    constructor(location: Coordinate) {
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
        this.blowingRight = true;
    }

    updatePolygon() {
        if (this.blowingRight)
            this.points = this.pointsRight;
        else
            this.points = this.pointsLeft;
    }
}
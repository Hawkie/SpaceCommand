import { ShapeLocatedModel } from "ts/Models/PolyModels";
import { LandingBasicShipModel } from "ts/Models/Ships/LandingShip";
import { Coordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";

export class LandingPadModel extends ShapeLocatedModel {
    
    constructor(location : Coordinate){
        var points = [
            new Coordinate(-10, -2),
            new Coordinate(-13, 10),
            new Coordinate(-10, 0),
            new Coordinate(10, 0),
            new Coordinate(13, 10),
            new Coordinate(10, -2)
        ];
        //var polygon = new Polygon(points);
        super(points, location);
    }
    
}
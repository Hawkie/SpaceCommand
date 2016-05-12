import { ShapeLocatedModel } from "../Models/PolyModels";
import { LandingBasicShipModel } from "../Ships/LandingShip";
import { Coordinate } from "../Physics/Common";
import { Transforms } from "../Physics/Transforms";

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
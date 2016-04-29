import { StaticGameObject } from "../Common/GameObject";
import { IBuilding } from "./Building";
import { Coordinate } from "../Common/Coordinate";
import { Polygon } from "../DisplayObjects/DisplayObject";

export class CoalPlant extends StaticGameObject implements IBuilding{
    cost : number;
    powerAffect : number;
    workersAffect : number;
    
    constructor(location : Coordinate){
        var points : Coordinate[] = [new Coordinate(20, -20),
                                     new Coordinate(-20, -20),
                                     new Coordinate(-20, 20),
                                     new Coordinate(20, 20)]; // Big 'C'
        super(new Polygon(points), location);
        
        this.cost = 100;
        this.powerAffect = 20;  // Adds 20 power
        this.workersAffect = -2;
    }
    
    drawResources(resources){
        // TODO: Remove coal.
    }
}
import { Coordinate } from "ts/Physics/Common";
import { IActor } from "ts/Actors/Actor";
import { IWind, Direction } from "ts/Data/WindData";
import { IShape, ShapeData } from "ts/Data/ShapeData";

export class WindGenerator implements IActor {
    pointsRight: Coordinate[];
    pointsLeft: Coordinate[];

    constructor(private data: IWind, private shape:IShape, private windChangeChance: number = 0.05) {
        this.pointsRight = [new Coordinate(-15, 10),
            new Coordinate(15, 10),
            new Coordinate(15, 20),
            new Coordinate(30, 0),
            new Coordinate(15, -20),
            new Coordinate(15, -10),
            new Coordinate(-15, -10),
            new Coordinate(-15, 10)];

        this.pointsLeft = [new Coordinate(20, 10),
            new Coordinate(-10, 10),
            new Coordinate(-10, 20),
            new Coordinate(-25, 0),
            new Coordinate(-10, -20),
            new Coordinate(-10, -10),
            new Coordinate(20, -10),
            new Coordinate(20, 10)];
    }

    update(timeModifier: number) {
        // TODO take lastTimeModifier into account
        if (Math.random() < this.windChangeChance) {
            console.log("Changing wind!");

            var wind = this.data.value;
            var newWind = wind + Math.round((Math.random() * 8)) - 4;
            var maxWind = Math.min(newWind, 20);
            var minWind = Math.max(maxWind, -20);
            this.data.value = minWind;

            if (this.data.value < 0) {
                this.data.windDirection = Direction.left;
                this.shape.points = this.pointsLeft;
            } else {
                this.data.windDirection = Direction.right;
                this.shape.points = this.pointsRight;
            }
        }
    }
}
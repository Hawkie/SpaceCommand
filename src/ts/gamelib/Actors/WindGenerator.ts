import { Coordinate } from "ts/gamelib/Data/Coordinate";
import { IActor } from "ts/gamelib/Actors/Actor";
import { IWind, Direction } from "ts/gamelib/Data/Wind";
import { IShape, Shape } from "ts/gamelib/Data/Shape";

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

    update(timeModifier: number): void {
        // tODO take lastTimeModifier into account
        if (Math.random() < this.windChangeChance) {
            console.log("Changing wind!");

            var wind: number = this.data.value;
            var newWind: number = wind + Math.round((Math.random() * 8)) - 4;
            var maxWind: number = Math.min(newWind, 5);
            var minWind: number = Math.max(maxWind, -5);
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
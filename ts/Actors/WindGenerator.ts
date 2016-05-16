import { IActor } from "ts/Actors/Actor";
import { WindData, Direction } from "ts/Models/Land/WindModel";

export class WindGenerator implements IActor {
    constructor(private data: WindData, private windChangeChance: number = 0.05) {
    }

    update(timeModifier: number) {
        // TODO take lastTimeModifier into account
        if (Math.random() < this.windChangeChance) {
            console.log("Changing wind!");

            var wind = this.data.windStrength.value;
            var newWind = wind + Math.round((Math.random() * 8)) - 4;
            var maxWind = Math.min(newWind, 20);
            var minWind = Math.max(maxWind, -20);
            this.data.windStrength.value = minWind;

            // change polygon
            if (this.data.windStrength.value < 0) {
                this.data.windRightLeft = Direction.left;
            } else {
                this.data.windRightLeft = Direction.right;
            }
            this.data.updatePolygon();
        }
    }
}
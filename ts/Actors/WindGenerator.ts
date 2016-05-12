import { IActor } from "../Actors/Actor";
import { WindModel, Direction } from "../Models/Land/WindModel";

export class WindGenerator implements IActor {
    constructor(private model: WindModel, private windChangeChance: number = 0.05) {
    }

    update(timeModifier: number) {
        // TODO take lastTimeModifier into account
        if (Math.random() < this.windChangeChance) {
            console.log("Changing wind direction!");
            if (this.model.windRightLeft == Direction.right) {
                this.model.windRightLeft = Direction.left;
            } else {
                this.model.windRightLeft = Direction.right;
            }
            this.model.updatePolygon();

            var wind = this.model.windStrength.value;
            var newWind = wind + Math.round((Math.random() * 4)) - 2;
            var maxWind = Math.min(newWind, 20);
            var minWind = Math.max(maxWind, 0);
            this.model.windStrength.value = minWind;
        }
    }
}
import { IActor } from "../Actors/Actor";
import { WindModel, Direction } from "../Models/Land/WindModel";

export class WindGenerator implements IActor {
    constructor(private model: WindModel, private windChangeChance: number = 0.1) {
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
        }
    }
}
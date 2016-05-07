import { WindDirectionIndicator } from "../Gui/WindDirectionIndicator";
import { Coordinate } from "../Physics/Common";
import { LocatedAngledMovingGO } from "../GameObjects/GameObject";
import { GuiText } from "../Gui/GuiText";
import { DrawContext} from "../Common/DrawContext";

export class Wind extends WindDirectionIndicator {
    private text: GuiText;

    constructor(location: Coordinate, private windSpeed: number, private windChangeChance: number) {
        super(location);
        this.text = new GuiText(String(this.windSpeed / 4) + " mph", new Coordinate(location.x - 12, location.y + 2), "monospace", 12);
    }

    update(lastTimeModifier: number, player: LocatedAngledMovingGO = null) { // default to null so overloading works
        super.update(lastTimeModifier);
        if (player) {
            if (this.blowingRight) {
                player.velX += (this.windSpeed * lastTimeModifier);
            } else {
                player.velX -= (this.windSpeed * lastTimeModifier);
            }
        }

        // TODO take lastTimeModifier into account
        if (!(Math.floor(Math.random() * this.windChangeChance))) { // there's a 1 in windChangeChance of the wind changing direction
            console.log("Changing wind direction!");
            this.changeWindDirection();
        }

        this.text.update(lastTimeModifier);
    }

    display(drawingContext: DrawContext) {
        super.display(drawingContext);
        this.text.display(drawingContext);
    }
}
import { WindDirectionIndicator } from "../Gui/WindDirectionIndicator";
import { Coordinate } from "../Common/Coordinate";
import { MovingGameObject } from "../Common/GameObject";
import { GuiText } from "../Gui/GuiText";
import { DrawContext} from "../Common/DrawContext";

export class Wind extends WindDirectionIndicator{
    windSpeed : number;
    windChangeChance : number;
    private text : GuiText;
    
    constructor(location : Coordinate, windSpeed : number, windChangeChance : number){
        super(location);
        this.windSpeed = windSpeed;
        this.windChangeChance = windChangeChance;
        this.text = new GuiText(String(this.windSpeed * 10) + " mph", new Coordinate(location.x - 12, location.y + 2), "monospace", 12);
    }
    
    update(lastTimeModifier : number, player : MovingGameObject = null){ // default to null so overloading works
        super.update(lastTimeModifier);
        if(player){
            if(this.blowingRight){
                player.velx += this.windSpeed;
            }else{
                player.velx -= this.windSpeed;
            }
        }
        
        if(!(Math.floor(Math.random() * this.windChangeChance))){ // there's a 1 in windChangeChance of the wind changing direction
            console.log("Changing wind direction!");
            this.changeWindDirection();
        }
        
        this.text.update(lastTimeModifier);
    }
    
    display(drawingContext : DrawContext){
        super.display(drawingContext);
        this.text.display(drawingContext);
    }
}
import { WindDirectionIndicator } from "../Gui/WindDirectionIndicator";
import { Coordinate } from "../Common/Coordinate";
import { MovingGameObject } from "../Common/GameObject";

export class Wind extends WindDirectionIndicator{
    windSpeed : number;
    windChangeChance : number;
    
    constructor(location : Coordinate, windSpeed : number, windChangeChance : number){
        super(location);
        this.windSpeed = windSpeed;
        this.windChangeChance = windChangeChance;
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
    }
}
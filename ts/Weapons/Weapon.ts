import { IGameObject, LocatedAngledMovingGO } from "../GameObjects/GameObject";
import { DrawContext} from "../Common/DrawContext";
import { Bullet } from "./Bullet"
import { Coordinate } from "../Common/Coordinate"

export interface IWeapon extends IGameObject{
    pullTrigger(x : number, y : number, angle : number);
    projectiles : Array<LocatedAngledMovingGO>;
    
}

export class BasicGun implements IWeapon {
    //properties
    fireRatePerSecond : number;
    velocity : number;
    offsetAngle : number;
    range : number;
    
    // state
    lastFired : number;
    projectiles : Array<LocatedAngledMovingGO>;
    constructor(){
        this.fireRatePerSecond = 2;
        this.velocity = 128;
        this.offsetAngle = 0;
        // 0= infinite range
        this.range = 0;
        this.lastFired = 0;
        this.projectiles = [];
     }
     
     update(lastTimeModifier : number){
         this.projectiles.forEach(bullet => bullet.update(lastTimeModifier));
     }
     
     display(drawingContext : DrawContext){
         this.projectiles.forEach(bullet => bullet.display(drawingContext));
     }
          
     pullTrigger(x : number, y : number, shipAngle : number) {
        var now = Date.now();
        var secElapsed = (now - this.lastFired)/1000;
        if (secElapsed >= 1/this.fireRatePerSecond)
        {
            var b = new Bullet(new Coordinate(x, y), shipAngle + this.offsetAngle, this.velocity);
            this.projectiles.push(b);
            this.lastFired = now;
        }
    }
    
    
}
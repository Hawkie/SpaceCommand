import { IGameObject, IHittable, GameObjectArray } from "../Common/GameObject";
import { DrawContext} from "../Common/DrawContext";
import { Bullet } from "./Bullet"
import { Coordinate } from "../Common/Coordinate"

export interface IWeapon extends IGameObject{
    pullTrigger(x : number, y : number, angle : number);
    
}

export class BasicGun implements IWeapon {
    //properties
    fireRatePerSecond : number;
    velocity : number;
    offsetAngle : number;
    range : number;
    
    // state
    lastFired : number;
    projectiles : GameObjectArray;
    constructor(){
        this.fireRatePerSecond = 2;
        this.velocity = 128;
        this.offsetAngle = 0;
        // 0= infinite range
        this.range = 0;
        this.lastFired = 0;
        this.projectiles = new GameObjectArray();
     }
     
     update(lastTimeModifier : number){
         this.projectiles.update(lastTimeModifier);
     }
     
     display(drawingContext : DrawContext){
         this.projectiles.display(drawingContext);
     }
     
     hitTest(hitableObjects : Array<IHittable>){
         
     }
          
     pullTrigger(x : number, y : number, shipAngle : number) {
        var now = Date.now();
        var secElapsed = (now - this.lastFired)/1000;
        if (secElapsed >= 1/this.fireRatePerSecond)
        {
            var b = new Bullet(new Coordinate(x, y), shipAngle + this.offsetAngle, this.velocity);
            this.projectiles.add(b); 
            this.lastFired = now;
        }
    }
    
    
}
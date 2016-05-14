import { Coordinate, Vector } from "ts/Physics/Common"
import { BulletModel } from "ts/Models/Weapons/Bullet"
import { IParticleFieldModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";

export interface IWeapon extends IParticleFieldModel{
    pullTrigger(x : number, y : number, angle : number);
}

export class BasicGunModel extends ParticleFieldModel implements IWeapon {
    constructor(private velocity: number = 128, firePerSec: number = 2, private offsetAngle: number = 0) {
        super(firePerSec);
    }
          
     pullTrigger(x : number, y : number, shipAngle : number) {
        var now = Date.now();
        var secElapsed = (now - this.lastCheck)/1000;
        if (secElapsed >= 1/this.itemsPerSec)
        {
            var b = new BulletModel(new Coordinate(x, y), new Vector(shipAngle + this.offsetAngle, this.velocity));
            this.points.push(b);
            this.lastCheck = now;
        }
    }
}
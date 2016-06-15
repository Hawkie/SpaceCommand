import { Coordinate, Vector } from "ts/Physics/Common"
import { IParticleData, ParticleData, ParticleDataVectorConstructor } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";

import { MovingParticleModel } from "ts/Models/ParticleFieldModel";

export interface IWeaponData extends IParticleFieldData{
    fired: boolean;
    pullTrigger(x : number, y : number, angle : number);
}

export class WeaponData extends ParticleFieldData implements IWeaponData {
    fired: boolean;

    constructor(private velocity: number = 128, firePerSec: number = 2, private offsetAngle: number = 0) {
        super(firePerSec);
        this.fired = false;
    }
          
     pullTrigger(x : number, y : number, shipAngle : number) {
        var now = Date.now();
        var secElapsed = (now - this.lastCheck)/1000;
        if (secElapsed >= 1/this.itemsPerSec)
        {
            var b = new ParticleDataVectorConstructor(new Coordinate(x, y), new Vector(shipAngle + this.offsetAngle, this.velocity));
            this.particles.push(new MovingParticleModel(b));
            this.lastCheck = now;
            this.fired = true;
        }
    }
}
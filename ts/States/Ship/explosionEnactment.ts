import { Coordinate, Vector } from "ts/Physics/Common";
import { ILocatedMoving } from "ts/Data/PhysicsData";
import { ForwardAccelerator, VectorAccelerator } from "ts/Actors/Accelerators";
import { Mover } from "ts/Actors/Movers";
import { IActor } from "ts/Actors/Actor";
import { IParticleData, ParticleData } from "ts/Data/ParticleData";
import { IParticleFieldData, ParticleFieldData } from "ts/Data/ParticleFieldData";
import { ParticleModel, ParticleFieldModel } from "ts/Models/ParticleFieldModel";
import { ParticleGenerator, ParticleModelUpdater } from "ts/Actors/ParticleFieldUpdater";
import { ParticleField } from "ts/GameObjects/ParticleField";
import { AudioObject } from "ts/Sound/SoundObject";

export class ExplosionEnactment extends ParticleField {
    explosionSound: AudioObject;
    soundPlayed: boolean;
    
    constructor(model:ParticleFieldModel) {
        super(model, 3, 3);
        this.explosionSound = new AudioObject("res/sound/explosion.wav");
        this.soundPlayed = false;
    }

    on() {
        this.model.turnOn();
        if (!this.soundPlayed) {
            this.explosionSound.play();
            this.soundPlayed = true;
        }
    }

    off() {
        this.model.turnOff();
        this.explosionSound.pause();
        this.soundPlayed = false;
    }

    static createGroundExplosion(data: ILocatedMoving): ParticleFieldModel {
        var explosionParticlesData = new ParticleFieldData(50, 5, 0.2, false);
        var explosionParticlesModel: ParticleFieldModel = new ParticleFieldModel(explosionParticlesData,
            (now: number) => {
                var p = new ParticleData(data.location.x,
                    data.location.y,
                    (Math.random() - 0.5) * 20,
                    (Math.random() * -30),
                    now);
                var mover = new Mover(p);
                var gravity = new VectorAccelerator(p, new Vector(180, 10));
                return new ParticleModel(p, [mover, gravity]);
            });
        
        return explosionParticlesModel;
    }

    static createSpaceExplosion(data: ILocatedMoving): ParticleFieldModel {
        var explosionParticlesData = new ParticleFieldData(50, 5, 0.2, false);
        var explosionParticlesModel: ParticleFieldModel = new ParticleFieldModel(explosionParticlesData,
            (now: number) => {
                var p = new ParticleData(data.location.x,
                    data.location.y,
                    data.velX + ((Math.random() - 0.5) * 20),
                    data.velY + ((Math.random() - 0.5) * 20),
                    now);
                var mover = new Mover(p);
                return new ParticleModel(p, [mover]);
            });

        return explosionParticlesModel;
    }
}
import { IControls } from "../../States/Asteroids/createAsteroidData";
import { MultiGameObject } from "ts/gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";
import { IActor } from "ts/gamelib/Actors/Actor";
import { createWeaponController } from "ts/game/Objects/Ship/Controllers/createWeaponController";
import { IParticle } from "ts/game/Objects/Particle/IParticle";
import { AgePred } from "ts/gamelib/Actors/ParticleFieldUpdater";
import { ParticleRemover } from "ts/gamelib/Actors/ParticleRemover";
import { IShip, IWeapon } from "./IShip";
import { createBulletObject } from "./createBulletObject";

// creates a weapon object
export function createWeaponObject(getControls: () => IControls,
  getShip: () => IShip,
  getWeapon: () => IWeapon): MultiGameObject<SingleGameObject> {
    var weapon: IWeapon = getWeapon();
    // todo: change this to weapon (not getWeapon)
    let bulletObjs: SingleGameObject[] = weapon.bullets.map((b) => createBulletObject(() => b));
    var weaponObj: MultiGameObject<SingleGameObject> = new MultiGameObject([], [], () => bulletObjs);
    var age5: AgePred<IParticle> = new AgePred(() => weapon.bulletLifetime, (p: IParticle) => p.born);
    var remover: ParticleRemover = new ParticleRemover(() => {
        ParticleRemover.remove(() => weapon.bullets, weaponObj.getComponents, [age5]);
    });
    // add the generator to the field object
    weaponObj.actors.push(remover);
    var weaponController: IActor = createWeaponController(() => {
        return {
            fire: getControls().fire,
            ship: getShip(),
            weapon: getShip().weapon1,
        };
    }, (newParticle: IParticle) => {
        getShip().weapon1.bullets.push(newParticle);
        var bulletObj: SingleGameObject = createBulletObject(() => newParticle);
        weaponObj.getComponents().push(bulletObj);
    });
    weaponObj.actors.push(weaponController);
    return weaponObj;
}
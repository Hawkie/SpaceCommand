import { IControls } from "../../States/Asteroids/createAsteroidData";
import { MultiGameObject } from "../../../gamelib/GameObjects/MultiGameObject";
import { SingleGameObject } from "../../../gamelib/GameObjects/SingleGameObject";
import { IActor } from "../../../gamelib/Actors/Actor";
import { createWeaponController } from "../../../../../src/ts/game/Objects/Ship/Controllers/createWeaponController";
import { IParticle } from "../../../../../src/ts/game/Objects/Particle/IParticle";
import { AgePred } from "../../../gamelib/Actors/ParticleFieldUpdater";
import { ParticleRemover } from "../../../gamelib/Actors/ParticleRemover";
import { IShip, IWeapon } from "./IShip";
import { createBulletObject } from "./createBulletObject";

// creates a weapon object
export function createWeaponObject(getControls: () => IControls,
  getShip: () => IShip,
  getWeapon: () => IWeapon): MultiGameObject<SingleGameObject> {
    let weapon: IWeapon = getWeapon();
    // todo: change this to weapon (not getWeapon)
    let bulletObjs: SingleGameObject[] = weapon.bullets.map((b) => createBulletObject(() => b));
    let weaponObj: MultiGameObject<SingleGameObject> = new MultiGameObject([], [], () => bulletObjs);
    let age5: AgePred<IParticle> = new AgePred(() => weapon.bulletLifetime, (p: IParticle) => p.born);
    let remover: ParticleRemover = new ParticleRemover(() => {
        ParticleRemover.remove(() => weapon.bullets, weaponObj.getComponents, [age5]);
    });
    // add the generator to the field object
    weaponObj.actors.push(remover);
    let weaponController: IActor = createWeaponController(() => {
        return {
            fire: getControls().fire,
            ship: getShip(),
            weapon: getShip().weapon1,
        };
    }, (newParticle: IParticle) => {
        getShip().weapon1.bullets.push(newParticle);
        let bulletObj: SingleGameObject = createBulletObject(() => newParticle);
        weaponObj.getComponents().push(bulletObj);
    });
    weaponObj.actors.push(weaponController);
    return weaponObj;
}
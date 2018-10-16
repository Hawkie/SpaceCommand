import { IInteractor } from "ts/gamelib/Interactors/Interactor";
import { ICoordinate } from "ts/gamelib/Data/Coordinate";
import { Transforms } from "ts/gamelib/Physics/Transforms";
import { IShape } from "ts/gamelib/Data/Shape";
import { SingleGameObject } from "ts/gamelib/GameObjects/SingleGameObject";


export interface IShapedLocation {
    location: ICoordinate;
    shape: IShape;
}

export class Multi2FieldCollisionDetector implements IInteractor {
    constructor(private model1s: () => IShapedLocation[],
    private points2: () => ICoordinate[],
    private hit: (i1:number, i2:number) => void,
        private searchFirstHitOnly: boolean = true) {
    }

    test(lastTestModifier: number): void {
        let found: boolean = false;
        let targets: IShapedLocation[] = this.model1s();
        let hitters: ICoordinate[] = this.points2();
        for (let i1: number = targets.length - 1; i1 >= 0; i1--) {
            let target:IShapedLocation = targets[i1];
            for (let i2: number = hitters.length - 1; i2 >= 0; i2--) {
                let hitter:ICoordinate = hitters[i2];
                if (Transforms.hasPoint(target.shape.points, target.location, hitter)) {
                    this.hit(i1, i2);
                    if (this.searchFirstHitOnly) {
                        found = true;
                        break;
                    }
                }
            }
            // only hit one object (game speed optimisation)
            if (found) {
                break;
            }
        }
    }
}



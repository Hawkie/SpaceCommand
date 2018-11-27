import { IInteractor } from "../Interactors/Interactor";
import { ICoordinate } from "../DataTypes/Coordinate";
import { Transforms } from "../Physics/Transforms";
import { IShape } from "../DataTypes/Shape";


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


export function Detector(targets: IShapedLocation[], hitters: ICoordinate[], firstOnly: boolean = false): void {
    let found: boolean = false;
    for (let i1: number = targets.length - 1; i1 >= 0; i1--) {
        let target:IShapedLocation = targets[i1];
        for (let i2: number = hitters.length - 1; i2 >= 0; i2--) {
            let hitter:ICoordinate = hitters[i2];
            if (Transforms.hasPoint(target.shape.points, target.location, hitter)) {
                this.hit(i1, i2);
                if (firstOnly) {
                    found = true;
                    break;
                }
            }
        }
        // (if firstOnly - game speed optimisation - exit loop)
        if (found) {
            break;
        }
    }
}


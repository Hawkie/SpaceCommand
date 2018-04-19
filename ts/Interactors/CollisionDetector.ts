import { IInteractor } from "ts/Interactors/Interactor";
import { Coordinate, ICoordinate } from "ts/Physics/Common";
import { Transforms } from "ts/Physics/Transforms";
import { ILocated } from "ts/Data/PhysicsData";
import { IShape } from "ts/Data/ShapeData";
import { IShapedModel, ShapedModel } from "ts/Models/DynamicModels";
import { SingleGameObject } from "ts/GameObjects/GameObject";


export interface IShapedLocation {
    location: ICoordinate;
    shape: IShape;
}

export class ObjectCollisionDetector implements IInteractor {
    constructor(private getModel1: ()=>IShapedLocation, private point: ICoordinate, private hit: () => void) {
    }

    test(lastTestModifier: number): void {
        var model1: IShapedLocation = this.getModel1();
        if (Transforms.hasPoint(model1.shape.points,
            model1.location, this.point)) {
            this.hit();
        }
    }
}

export class Multi2ShapeCollisionDetector implements IInteractor {
    constructor(private model1s: () => IShapedLocation[],
        private sourceModel:()=> IShapedLocation,
        private hit: (i1: number, i2: number) => void,
        private searchFirstHitOnly: boolean = true) {
    }

    test(lastTestModifier: number): void {
        let found: boolean = false;
        let targets:IShapedLocation[] = this.model1s();
        let shapeModel: IShapedLocation = this.sourceModel();
        for (let i1: number = targets.length - 1; i1 >= 0; i1--) {
            let target:IShapedLocation = targets[i1];
            for (let i2: number = shapeModel.shape.points.length - 1; i2 >= 0; i2--) {
                let point: ICoordinate = shapeModel.shape.points[i2];
                if (Transforms.hasPoint(target.shape.points,
                    target.location,
                    new Coordinate(shapeModel.location.x + shapeModel.shape.offset.x + point.x,
                        shapeModel.location.y + + shapeModel.shape.offset.y + point.y))) {
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


export class ShapeCollisionDetector implements IInteractor {
    constructor(private getModel: () => IShapedLocation,
        private points2: () => ICoordinate[],
        private hit: (i2:number, model2s: ICoordinate[]) => void,
        private searchFirstHitOnly: boolean = true) {
    }

    test(lastTestModifier: number): void {
        let found: boolean = false;
        let target: IShapedLocation = this.getModel();
        let hitters: ICoordinate[] = this.points2();
        for (let i2: number = hitters.length - 1; i2 >= 0; i2--) {
            let hitter:ICoordinate = hitters[i2];
            if (Transforms.hasPoint(target.shape.points, target.location, hitter)) {
                this.hit(i2, hitters);
                if (this.searchFirstHitOnly) {
                    found = true;
                    break;
                }
            }
        }
    }
}
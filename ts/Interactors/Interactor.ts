export interface IInteractor {
    test(lastTestModifier: number): void;
}

export class Interactor<TModel1, TModel2> implements IInteractor {
    constructor(private model1: TModel1, private model2: TModel2, private callBack: (number, model1, model2) => void) { }

    test(lastTestModifier: number): void {
        this.callBack(lastTestModifier, this.model1, this.model2);
    }
}


// Data Updater

export interface IActor {
    update(timeModifier: number);
}

export class Actor<ModelT> implements IActor {
    constructor(private model: ModelT, private actors: IActor[]) {

    }

    update(timeModifier: number) {
        this.actors.forEach(a => a.update(timeModifier));
    }
}
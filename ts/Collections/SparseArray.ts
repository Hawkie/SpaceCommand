export class SparseArray<T> extends Array<T> {
    constructor() {
            super();
        }

    public add(item : T): void {
        if (this.indexOf(item) === -1) {
            this.push(item);
        }
    }

    public remove(item : T): void {
        var index: number = this.indexOf(item);
        if (index > -1) {
            this.splice(index,1);
        }
    }

    public contains(item : T): boolean {
        if (this.indexOf(item) > -1) {
            return true;
        }
        return false;
    }
}
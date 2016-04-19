export class SparseArray<T> extends Array<T> {
    constructor(size? : number){
            super(size);
        }
    
    add(item : T){
        if (this.indexOf(item) == -1)
        {
            this.push(item);
        }
    }
    
    remove(item : T){
        var index = this.indexOf(item);
        if (index > -1)
        {
            this.splice(index,1);
        }
    }
    
    contains(item : T) : boolean {
        if (this.indexOf(item) > -1)
            return true;
        return false;
    }
}
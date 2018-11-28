
// this file shows some interesting test cases of object composition

// tslint:disable-next-line:interface-name
interface Date {
    ConvertToDateFromTS(msg: string): number;
}

Date.prototype.ConvertToDateFromTS = function(msg: string): number {
    return Date.now();
};


// example of object composition (no inheritance)
interface IAnimal<T> {
    name: string;
    legs: T;
}

interface IDogBehaviour<T> {
    woofFactor: number;
    bark: (woofFactor: T, action: number) => T;
}

interface ICatBehaviour<T> {
    cuteFactor: number;
    meow: (action: number) => T;
}

// composition of Animal and Dog Behaviour
interface IDog<T> extends IAnimal<T>, IDogBehaviour<T> {}

// composition of Animal and Cat behaviour
interface ICat<T> extends IAnimal<T>, ICatBehaviour<T> {}

// a dog function. Example of function not using the this keyword
function bark<T extends number>(woofFactor: T, action: number): T { return woofFactor + action as T;}

// one example using this
function meow(this: ICat<number>, action: number): number { return this.cuteFactor + action; }

// create a base animal
var myA: IAnimal<number> = { name: "Blobby", legs: 4 };

// create a cat by merging Animal (myA) and some cat behaviour using spread operator
var myC:ICat<number> = {...myA,
        name: "Fluffy",
        meow: meow,
        cuteFactor: 14,
        // cannot add random properties with spread operatorn
    };

// create a dog by merging Animal (myA) and some bark behaviour using Object assign
var myD:IDog<number> = Object.assign({}, myA, {
    name: "Wolfy",
    bark: bark,
    woofFactor: 10,
    c: 5, // can add random properties with Object.assign
});


test("Animal compositionTest", () => {
    expect(myA.legs).toBe(4);
});
test("Cat compositionTest", () => {
    const ACTION: number = 4;
    expect(myC.meow(ACTION)).toBe(18);
});

test("Dog compositionTest", () => {
    const ACTION: number = 4;
    expect(myD.bark(myD.woofFactor, ACTION)).toBe(14);
});

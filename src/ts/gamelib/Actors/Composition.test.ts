// tslint:disable-next-line:interface-name
interface Date {
    ConvertToDateFromTS(msg: string): number;
}

Date.prototype.ConvertToDateFromTS = function(msg: string): number {
    return Date.now();
};


// example of object composition (not inheritance)
interface Ia<T> {
    name: string;
    a: T;
}

interface Ib<T1, T> extends Ia<T1> {
    b: T1;
    bark: (x: T, y: T) => T;
}

interface Ic<T1, T> extends Ia<T1> {
    b: T1;
    bark: () => T;
}

function myFunction<T extends number>(x: T, y: T): T { return x + y as T;}

function myFunction2(): number { return this.a + this.b; }

var myA: Ia<number> = { name: "Ship", a: 3 };

// compose myB to be myA and bark and b
var myB:Ib<number, number> = {...myA,
    bark: myFunction,
    b: 4,
    // cannot add prop c: 5,
};

var myC:Ib<number, number> = Object.assign({}, myA, {
    bark: myFunction,
    b: 14,
    c: 5,
    });

var myD:Ic<number, number> = Object.assign({}, myA, {
    bark: myFunction2,
    b: 14,
    c: 5,
    });

test("compositionTest", () => {
    expect(myA.a).toBe(3);
});

test("compositionTest", () => {
    expect(myB.bark(myB.a, myB.b)).toBe(7);
});

test("compositionTest", () => {
    expect(myC.bark(myC.a, myC.b)).toBe(17);
});

test("compositionTest", () => {
    expect(myD.bark()).toBe(17);
});
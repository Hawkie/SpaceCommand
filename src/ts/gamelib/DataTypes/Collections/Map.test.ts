test("Access Map", () => {
    let m: { [i: number]: number } = { 2: 2, 4: 5, 5: 7 };
    let result: number = m[4]; // read value using key 4
    console.log("Map:" + result);
    expect(result).toBeCloseTo(5);
});
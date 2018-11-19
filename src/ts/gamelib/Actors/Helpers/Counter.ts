export function AddElapsedTime(timeModifier: number, elapsedTime: number, timeCheck: number = undefined): number {
    let accumulatedTime: number = elapsedTime + timeModifier;
    if (timeCheck !== undefined && accumulatedTime >= timeCheck) {
        accumulatedTime = 0;
    }
    return accumulatedTime;
}

export function IncreaseCounter(counter: number, resetWhen: number = undefined, resetTo:number = 0): number {
    counter++;
    // check our index is within frame array
    if (resetWhen !== undefined && counter >= resetWhen) {
        counter = resetTo;
    }
    return counter;
}

export function Toggle(value: number): number {
    if (value === 0) {
        return 1;
    }
    return 0;
}
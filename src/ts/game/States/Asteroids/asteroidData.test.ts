import { move, IMoveOut, Move, IMoveable } from "../../../gamelib/Actors/Movers";
import { IBall, createBallData } from "./createAsteroidData";
import { IViewFn, BallData } from "../../Objects/Asteroids/createBall";
import { DrawContext } from "../../../gamelib/1Common/DrawContext";
import { DisplayCircle } from "../../../gamelib/Views/CircleView";

export interface IState {
    anyNumber: number;
    ball: IBall;
}

// example one. Direct change of state in to state out.
// limitation is that each time state model changes, this function will need to change
export function testBallMove1(state1: IState): IState {
    const { ball: {x: X, y: Y, Vx: VX, Vy: VY}} = state1;
    console.log(VX, VY); // 10, 20
    const v:IMoveOut = move(10, VX, VY);
    const state2: IState = Object.assign({},
        state1, {
            ball: Object.assign({}, state1.ball, {x: X+v.dx, y: Y+v.dy}),
        });

    return state2;
}

export function GetBallFromState(state: IState): IBall {
    const b1: IBall = state.ball;
    return b1;
}

export function SetBallInState(state: IState, ball: IBall): IState {
    state.ball = ball;
    return state;
}

export function testBallMove2(state1: IState): IState {
    // destructuring assignment of move inputs (x,y) from state
    // const {ball: {x: x2}, ball: {y: y2}} = state1;
    // map state to props
    const b1: IBall = GetBallFromState(state1);

    // mapstatetodispatch
    // destruct input params to actor from state
    // const { ball: {x: X, y: Y, Vx: VX, Vy: VY}} = state1;
    const b2:IBall = Move<IBall>(10, b1.Vx, b1.Vy, b1);

    // reassign state
    return SetBallInState(state1, b2);
}

export function testBallView(state1: IState): void {

    const stateToBallView: (state: IState) => IViewFn = (state: IState) => {
        const b1: IBall = state1.ball;
        const {x: xPos, y: yPos, r: radius} = b1;
        let ballView: IViewFn = (ctx: DrawContext) => DisplayCircle(ctx,
            b1.x,
            b1.y,
            b1.r);
            return ballView;
    };
}

test("my move test for changing x and y", () => {
    const state: IState = { anyNumber: 2, ball: {x: 10, y: 20, Vx: 3, Vy: 4, mass: 12, r: 7}};
    let result: IState = testBallMove2(state);
    expect(result.ball.x).toBeCloseTo(40); // 10 + 10 * 3
    expect(result.ball.y).toBeCloseTo(60); //  20 + 10 * 4
});

test("my move test for unchanging mass", () => {
    const state: IState = { anyNumber: 2, ball: {x: 10, y: 20, Vx: 3, Vy: 4, mass: 12, r: 7}};
    let result: IState = testBallMove2(state);
    expect(result.ball.mass).toBeCloseTo(12); // 12
});

test("my move test for unchanging anyNumber", () => {
    const state: IState = { anyNumber: 2, ball: {x: 10, y: 20, Vx: 3, Vy: 4, mass: 12, r: 7}};
    let result: IState = testBallMove2(state);
    expect(result.anyNumber).toBeCloseTo(2); // 2
});
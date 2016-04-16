import { Canvas } from "./Canvas";
import { IGameState } from "./GameState";
import { DrawContext } from "./DrawContext";
import { SparseArray } from "../Collections/SparseArray";

export class EventLoop {
    canvas : Canvas;
    window : any;
    private keysDown : SparseArray<number>;
    gameState : IGameState;
    
    constructor(window : Window, canvas : Canvas, state : IGameState) {
        this.window = window;
        this.canvas = canvas; 
        this.gameState = state;
        this.keysDown = new SparseArray<number>(10);
        this.addKeyEvents();
    }
    
    addKeyEvents(){
        var self = this;
        var kd = function doKeyDown(e : KeyboardEvent) {
            self.keysDown.add(e.keyCode);
            console.log("Down" + e.type + e.keyCode + e.key);
            console.log(self.keysDown);
        }
        
        var ku = function doKeyUp(e : KeyboardEvent) {
            self.keysDown.remove(e.keyCode);
            console.log("Up" + e.type + e.keyCode + e.key);
            console.log(self.keysDown);
        }
        
        this.window.addEventListener("keydown", kd, false);
        this.window.addEventListener("keypress", kd, false);
        this.window.addEventListener("onkeydown", kd, false);
        this.window.addEventListener("keyup", ku, false);
    }
   
    
    
    // removeKeyEvents(){
    //     let self = this;
    //     removeEventListener("onkeydown", self.keyDown);
    //     removeEventListener("onkeyup", self.keyUp);
    // }
    
    loop() {
        var w = this.window;
        var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
        var then = Date.now();
        let dc : DrawContext = this.canvas.context();
        var keys = () => {return this.keysDown;}
        var gs = this.gameState;
        //console.log(keys);
        //var keys = this.keysDown;
        // The main game loop
        var myLoop = function() {
            var now = Date.now();
            var delta = now - then;
            gs.display(dc);
            gs.update(delta / 1000);
            gs.input(keys, delta / 1000);
            then = now;
            requestAnimationFrame(myLoop);
        }
        // Request to do this again ASAP
        myLoop();
    }
}
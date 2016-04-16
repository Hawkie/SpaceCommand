define(["require", "exports", "../Collections/SparseArray"], function (require, exports, SparseArray_1) {
    "use strict";
    var EventLoop = (function () {
        function EventLoop(window, canvas, state) {
            this.window = window;
            this.canvas = canvas;
            this.gameState = state;
            this.keysDown = new SparseArray_1.SparseArray(10);
            this.addKeyEvents();
        }
        EventLoop.prototype.addKeyEvents = function () {
            var self = this;
            var kd = function doKeyDown(e) {
                self.keysDown.add(e.keyCode);
                console.log("Down" + e.type + e.keyCode + e.key);
                console.log(self.keysDown);
            };
            var ku = function doKeyUp(e) {
                self.keysDown.remove(e.keyCode);
                console.log("Up" + e.type + e.keyCode + e.key);
                console.log(self.keysDown);
            };
            this.window.addEventListener("keydown", kd, false);
            this.window.addEventListener("keypress", kd, false);
            this.window.addEventListener("onkeydown", kd, false);
            this.window.addEventListener("keyup", ku, false);
        };
        // removeKeyEvents(){
        //     let self = this;
        //     removeEventListener("onkeydown", self.keyDown);
        //     removeEventListener("onkeyup", self.keyUp);
        // }
        EventLoop.prototype.loop = function () {
            var _this = this;
            var w = this.window;
            var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
            var then = Date.now();
            var dc = this.canvas.context();
            var keys = function () { return _this.keysDown; };
            var gs = this.gameState;
            //console.log(keys);
            //var keys = this.keysDown;
            // The main game loop
            var myLoop = function () {
                var now = Date.now();
                var delta = now - then;
                gs.display(dc);
                gs.update(delta / 1000);
                gs.input(keys, delta / 1000);
                then = now;
                requestAnimationFrame(myLoop);
            };
            // Request to do this again ASAP
            myLoop();
        };
        return EventLoop;
    }());
    exports.EventLoop = EventLoop;
});
//# sourceMappingURL=EventLoop.js.map
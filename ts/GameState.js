define(["require", "exports"], function (require, exports) {
    "use strict";
    var PlayGameState = (function () {
        function PlayGameState(player, objects) {
            this.player = player;
            this.objects = objects;
        }
        PlayGameState.prototype.update = function (lastDrawModifier) {
            this.player.update(lastDrawModifier);
            for (var index = 0; index < this.objects.length; index++) {
                var element = this.objects[index];
                element.update(lastDrawModifier);
            }
        };
        PlayGameState.prototype.input = function (keys, lastDrawModifier) {
            var k = keys();
            if (k.indexOf(38) > -1) {
                this.player.thrust(lastDrawModifier);
            }
            // // if (40 in keysDown) { // Player holding down
            // //     player.y += player.speed * lastDrawModifier;
            // // }
            if (k.indexOf(37) > -1) {
                this.player.rotateLeft(lastDrawModifier);
            }
            if (k.indexOf(39) > -1) {
                this.player.rotateRight(lastDrawModifier);
            }
            // // space bar (shoot)
            // if (32 in keysDown) {
            // }
        };
        PlayGameState.prototype.display = function (drawingContext) {
            drawingContext.clear();
            this.player.display(drawingContext);
            for (var index = 0; index < this.objects.length; index++) {
                var element = this.objects[index];
                element.display(drawingContext);
            }
        };
        PlayGameState.prototype.hasEnded = function () {
            return false;
        };
        return PlayGameState;
    }());
    exports.PlayGameState = PlayGameState;
});
//# sourceMappingURL=GameState.js.map
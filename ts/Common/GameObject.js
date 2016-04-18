var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Transforms"], function (require, exports, Transforms_1) {
    "use strict";
    var StaticGameObject = (function () {
        function StaticGameObject(displayObject, location) {
            this.displayObject = displayObject;
            this.location = location;
        }
        StaticGameObject.prototype.update = function (timeModifier) { };
        StaticGameObject.prototype.display = function (drawingContext) {
            this.displayObject.draw(this.location, drawingContext);
        };
        return StaticGameObject;
    }());
    exports.StaticGameObject = StaticGameObject;
    var MovingGameObject = (function (_super) {
        __extends(MovingGameObject, _super);
        function MovingGameObject(displayObject, location, velx, vely, angle, spin) {
            _super.call(this, displayObject, location);
            this.velx = velx;
            this.vely = vely;
            this.angle = angle;
            this.spin = spin;
        }
        MovingGameObject.prototype.update = function (timeModifier) {
            this.location.x += this.velx * timeModifier;
            this.location.y += this.vely * timeModifier;
            this.angle += this.spin * timeModifier;
        };
        MovingGameObject.prototype.display = function (drawingContext) {
            drawingContext.translate(this.location.x, this.location.y);
            drawingContext.rotate(this.angle);
            drawingContext.translate(-this.location.x, -this.location.y);
            _super.prototype.display.call(this, drawingContext);
            drawingContext.translate(this.location.x, this.location.y);
            drawingContext.rotate(-this.angle);
            drawingContext.translate(-this.location.x, -this.location.y);
        };
        MovingGameObject.prototype.angularThrust = function (thrust) {
            var velchange = Transforms_1.Transforms.toVector(this.angle, thrust);
            this.velx += velchange.x;
            this.vely += velchange.y;
        };
        return MovingGameObject;
    }(StaticGameObject));
    exports.MovingGameObject = MovingGameObject;
    var GameObjectArray = (function () {
        function GameObjectArray() {
            this.array = [];
        }
        GameObjectArray.prototype.add = function (o) {
            this.array.push(o);
        };
        GameObjectArray.prototype.update = function (lastTimeModifier) {
            for (var i = 0; i < this.array.length; i++) {
                var projectile = this.array[i];
                projectile.update(lastTimeModifier);
            }
            ;
        };
        GameObjectArray.prototype.display = function (drawingContext) {
            for (var i = 0; i < this.array.length; i++) {
                var projectile = this.array[i];
                projectile.display(drawingContext);
            }
            ;
        };
        return GameObjectArray;
    }());
    exports.GameObjectArray = GameObjectArray;
});
//# sourceMappingURL=GameObject.js.map
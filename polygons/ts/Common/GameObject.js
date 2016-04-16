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
    var Ship = (function (_super) {
        __extends(Ship, _super);
        function Ship(displayObject, location, velx, vely, angle, spin) {
            _super.call(this, displayObject, location, velx, vely, angle, spin);
            this.thrustPower = 16;
            this.rotationalPower = 64;
        }
        Ship.prototype.thrust = function (lastTimeModifier) {
            this.angularThrust(this.thrustPower * lastTimeModifier);
        };
        Ship.prototype.rotateLeft = function (lastTimeModifier) {
            this.angle -= this.rotationalPower * lastTimeModifier;
        };
        Ship.prototype.rotateRight = function (lastTimeModifier) {
            this.angle += this.rotationalPower * lastTimeModifier;
        };
        return Ship;
    }(MovingGameObject));
    exports.Ship = Ship;
});
//# sourceMappingURL=GameObject.js.map
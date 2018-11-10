using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace API.Tests
{
    public class Vector
    {
        public Vector(double length, double angle)
        {
            Length = length;
            Angle = angle;
        }

        public double Length { get; }
        public double Angle { get; }
    }

    public class PhysicsTest
    {

        [Theory]
        [InlineData(0, 0, 60, 20, 10, 2, 0)]
        [InlineData(90, 0, 60, 20, 10, 0, 3)]
        [InlineData(90, -90, 60, 20, 10, -2, 0)]
        [InlineData(45, 45, 60, 20, 10, 2, 0)]
        [InlineData(135, 45, 60, 20, 10, 0, 3)]
        public void BallPhysicsTest(double thrustAngle, double barAngle, double thrustForce, double massShip, double massBall, double resultPara, double resultPerp)
        {

            var barRadians = (barAngle / 180) * Math.PI;

            // split to parallel and perpenticular forces
            // parallel cos x cos, y cos
            var diffAngle =  thrustAngle - barAngle;
            var diffRadians = (diffAngle / 180) * Math.PI;
            // cos and sin are anticlockwise whereas my angles are clockwise.
            // use -
            var diffSin = Math.Sin(diffRadians); // sin 0 = 0, sin 90 = 1
            var diffCos = Math.Cos(diffRadians); // cos 0 = 1, cos 90 = 0
            //var sin = Math.Sin(-barRadians); // sin 0 = 0
            //var cos = Math.Cos(-barRadians); // cos 0 = 1
                                             //var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var aParallellToBar = diffCos * thrustForce / (massShip + massBall);
            var aPerpToBar = diffSin * thrustForce / (massShip);

            Assert.Equal(resultPara, aParallellToBar, 6);
            Assert.Equal(resultPerp, aPerpToBar, 6);
            
        }

        [Theory]
        [InlineData(0, 0, -1)]
        [InlineData(30, 0.5, -0.87)]
        [InlineData(90, 1, 0)]
        [InlineData(180, 0, 1)]
        [InlineData(270, -1, 0)]
        public void CoordinatePhysics(double barAngle, double x, double y)
        {
            var barRadians = (barAngle / 180) * Math.PI;
            var xa = Math.Sin(barRadians);
            var ya = -Math.Cos(barRadians);
            Assert.Equal(x, xa, 2);
            Assert.Equal(y, ya, 2);
            
        }

        [Theory]
        [InlineData(0, 90, 1, 0)]
        [InlineData(30, 90, 0.87, 0.5)]
        [InlineData(90, 90, 0, 1)]
        [InlineData(180, 90, -1, 0)]
        [InlineData(270, 90, 0, -1)]
        public void CoordinatePhysicsPerpPara(double barAngle, double shipAngle, double x, double y)
        {
            var barRadians = (barAngle / 180) *Math.PI;
            var diffRadians = ((shipAngle - barAngle) / 180) * Math.PI;
            var xa = Math.Sin(diffRadians);
            var ya = Math.Cos(diffRadians);
            Assert.Equal(x, xa, 2);
            Assert.Equal(y, ya, 2);

        }

        // x = sin the difference in angle, cos the -bar angle

        [Theory]
        [InlineData(0, 10, 10, 0)]
        [InlineData(10, 0, 10, 90)]
        [InlineData(0, -10, 10, 180)]
        [InlineData(-10, 0, 10, -90)]
        public void CoordinateToVectorTests(double x, double y, double length, double angle)
        {
            var vector = CartesianToVector(x, y);
            Assert.Equal(length, vector.Length, 2);
            Assert.Equal(angle, vector.Angle, 2);
        }

        [Theory]
        [InlineData(10, 0, 10, 1, 1, 180, -25)]
        [InlineData(0, -10, 10, 1, 1, 180, 0)]
        [InlineData(-10, 0, 10, 4, 1, 180, 4)]
        [InlineData(0, 10, 10, 1, 1, 180, 0)]
        public void PerpVelocityToForceTest(double velX, double velY, double radius, double mass1, double mass2, double degrees, double result)
        {
            var totalMass = mass1 + mass2;
            var cmRadius = radius * mass2 / totalMass;

            var v = CartesianToVector(velX, velY);
            var vAngleDiff = v.Angle - degrees;
            var vAngleDiffRadians = vAngleDiff / 180 * Math.PI;
            var vPerp = Math.Sin(vAngleDiffRadians);

            var fBar = vPerp * cmRadius * cmRadius;

            Assert.Equal(result, fBar, 2);
        }

        public Vector CartesianToVector(double x, double y)
        {
            var length = Math.Sqrt(x * x + y * y);
            var angle = Math.Atan2(x, y) * 180 / Math.PI;
            return new Vector(length, angle);
        }
    }
}

    

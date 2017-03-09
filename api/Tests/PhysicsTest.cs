using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace API.Tests
{
    public class PhysicsTest
    {

        [Theory]
        [InlineData(0, 0, 60, 20, 10, 2, 0)]
        [InlineData(90, 0, 60, 20, 10, 0, 3)]
        [InlineData(45, 45, 60, 20, 10, 2, 0)]
        [InlineData(135, 45, 60, 20, 10, 0, 3)]
        public void BallPhysicsTest(double thrustAngle, double barAngle, double thrustForce, double massShip, double massBall, double resultPara, double resultPerp)
        {

            var barRadians = (barAngle / 180) * Math.PI;

            // split to parallel and perpenticular forces
            // parallel cos x cos, y cos
            var diffAngle = barAngle - thrustAngle;
            var diffRadians = (diffAngle / 180) * Math.PI;
            // cos and sin are anticlockwise whereas my angles are clockwise.
            // use -
            var diffSin = Math.Sin(-diffRadians); // sin 0 = 0, sin 90 = 1
            var diffCos = Math.Cos(-diffRadians); // cos 0 = 1, cos 90 = 0
            var sin = Math.Sin(-barRadians); // sin 0 = 0
            var cos = Math.Cos(-barRadians); // cos 0 = 1
                                             //var forceV = Transforms.VectorToAxis(f.angle, f.length, v.angle);
            var aParallellToBar = diffCos * thrustForce / (massShip + massBall);
            var aPerpToBar = diffSin * thrustForce / (massShip);

            Assert.Equal(resultPara, aParallellToBar, 6);
            Assert.Equal(resultPerp, aPerpToBar, 6);
            
        }

        [Theory]
        [InlineData(0, 10, 0, -10)]
        [InlineData(30, 10, 5, -8.66)]
        [InlineData(90, 10, 10, 0)]
        [InlineData(180, 10, 0, 10)]
        [InlineData(270, 10, -10, 0)]
        public void CoordinatePhysics(double barAngle, double acceleration, double x, double y)
        {
            var barRadians = (barAngle / 180) * Math.PI;
            var xa = -Math.Sin(-barRadians) * acceleration;
            var ya = -Math.Cos(-barRadians) * acceleration;
            Assert.Equal(x, xa, 2);
            Assert.Equal(y, ya, 2);
            
        }

        [Theory]
        [InlineData(0, 10, 10, 0)]
        [InlineData(30, 10, 8.66, 5)]
        [InlineData(90, 10, 0, 10)]
        [InlineData(180, 10, -10, 0)]
        [InlineData(270, 10, 0, -10)]
        public void CoordinatePhysicsPerp(double barAngle, double acceleration, double x, double y)
        {
            var barRadians = (barAngle / 180) * Math.PI;
            var xa = Math.Cos(-barRadians) * acceleration;
            var ya = -Math.Sin(-barRadians) * acceleration;
            Assert.Equal(x, xa, 2);
            Assert.Equal(y, ya, 2);

        }

        [Theory]
        [InlineData(0.0001, 10, 10, 0)]
        [InlineData(10, 0.00001, 10, 90)]
        [InlineData(0, -10, 10, 180)]
        [InlineData(-10, 0.00001, 10, -90)]
        public void CoordinateToVectorTests(double x, double y, double length, double angle)
        {
            var l = Math.Sqrt(x * x + y * y);
            var a = Math.Atan2(x, y) * 180 / Math.PI;
            Assert.Equal(length, l, 2);
            Assert.Equal(angle, a, 2);
        }
    }
}
    

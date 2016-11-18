using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataTypes.Values
{
    public class ShipData
    {
        public string PlayerName { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int VelX { get; set; }
        public int VelY { get; set; }
        public string Username { get; private set; }

        public ShipData(string username, string playerName, int x, int y, int velX, int velY)
        {
            VelY = velY;
            VelX = velX;
            Y = y;
            X = x;
            PlayerName = playerName;
            Username = username;
        }
    }
}

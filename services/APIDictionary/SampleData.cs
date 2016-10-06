using APIDictionary;
using APIInterfaces.SystemTypes;
using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIDataTypes.Values;

namespace APIDictionary
{
    public static class SampleData
    {
        public static IDataLayer<int, string> SampleNames()
        {
            var f = new Func<string, int>((s) => { return 3; });
            var l = new List<Record<int, string>>();
            l.Add(new Record<int, string>(1, "Paul"));
            l.Add(new Record<int, string>(5, "Emma"));
            return new DictionaryData<int, string>(l, f);
        }


        public static IDataLayer<int, Ship> SamplePlayers()
        {
            var f = new Func<Ship, int>((s) => { return 3; });
            var l = new List<Record<int, Ship>>();
            l.Add(new Record<int, Ship>(1, new Ship("Paul", 0,0,0,0)));
            l.Add(new Record<int, Ship>(5, new Ship("Emma", 0, 0, 0, 0)));
            return new DictionaryData<int, Ship>(l, f);
        }
    }
}

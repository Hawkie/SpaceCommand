using APIInterfaces.SystemTypes;
using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIDataTypes.Values;
using APIDataTypes.Keys;

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


        public static IDataLayer<int, Ship> SampleShips()
        {
            var f = new Func<Ship, int>((s) => { return 3; });
            var l = new List<Record<int, Ship>>();
            l.Add(new Record<int, Ship>(1, new Ship("hawk", "Paul", 0,0,0,0)));
            l.Add(new Record<int, Ship>(5, new Ship("hun", "Emma", 0, 0, 0, 0)));
            return new DictionaryData<int, Ship>(l, f);
        }

        public static IDataLayer<ExternalUrl, WeightsDoc> SampleWeights()
        {
            var f = new Func<WeightsDoc, ExternalUrl>((s) => { return new ExternalUrl("TestId", "TestT", "TestOwner", DateTime.MinValue); });
            var l = new List<Record<ExternalUrl, WeightsDoc>>();
            var wts1 = new List<Weight>();
            wts1.Add(new Weight("C Z6", 10));
            wts1.Add(new Weight("CLZ6", 5));

            var wts2 = new List<Weight>();
            wts2.Add(new Weight("LCZ6", 11));
            wts2.Add(new Weight("LHZ6", 6));

            l.Add(new Record<ExternalUrl, WeightsDoc>(new ExternalUrl("TVI", "contracts", "trader", new DateTime(2016, 10, 5)), new WeightsDoc(wts1)));
            l.Add(new Record<ExternalUrl, WeightsDoc>(new ExternalUrl("TVI", "contracts", "trader", new DateTime(2016, 10, 6)), new WeightsDoc(wts2)));
            return new DictionaryData<ExternalUrl, WeightsDoc>(l, f);
        }
    }
}

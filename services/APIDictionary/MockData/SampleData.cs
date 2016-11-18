using APIInterfaces.SystemTypes;
using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIDataTypes.Values;
using APIDataTypes.Keys;
using APIDataTypes.KeyMappers;

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


        public static IDataLayer<int, ShipData> SampleShips()
        {
            var f = new Func<ShipData, int>((s) => { return 3; });
            var l = new List<Record<int, ShipData>>();
            l.Add(new Record<int, ShipData>(1, new ShipData("hawk", "Paul", 0,0,0,0)));
            l.Add(new Record<int, ShipData>(5, new ShipData("hun", "Emma", 0, 0, 0, 0)));
            return new DictionaryData<int, ShipData>(l, f);
        }

        public static IDataLayer<InternalUrl, WeightsData> SampleWeights()
        {
            var f = new Func<WeightsData, InternalUrl>((s) => { return new InternalUrl("TestId", "TestT", "TestLocation", "TestOwner", DateTime.MinValue); });

            var wts1 = new List<WeightItemData>();
            wts1.Add(new WeightItemData("C Z6", 10));
            wts1.Add(new WeightItemData("CLZ6", 5));

            var wts2 = new List<WeightItemData>();
            wts2.Add(new WeightItemData("LCZ6", 11));
            wts2.Add(new WeightItemData("LHZ6", 6));

            var records = new List<Record<InternalUrl, WeightsData>>();
            records.Add(new Record<InternalUrl, WeightsData>(CreateInternalKey(), new WeightsData(wts1)));
            records.Add(new Record<InternalUrl, WeightsData>(CreateInternalKey2(), new WeightsData(wts2)));

            return new DictionaryData<InternalUrl, WeightsData>(records, f);
        }

        private static WeightKey CreateExternalKey()
        {
            return new WeightKey("TVI", "contracts", "trader", new DateTime(2016, 10, 5));
        }

        private static WeightKey CreateExternalKey2()
        {
            return new WeightKey("TVI", "contracts", "trader", new DateTime(2016, 5, 6));
        }

        private static InternalUrl CreateInternalKey()
        {
            return new InternalUrl("TVI", "contracts", "index.A", "trader", new DateTime(2016, 10, 5));
        }

        private static InternalUrl CreateInternalKey2()
        {
            return new InternalUrl("TVI", "contracts", "index.B", "trader", new DateTime(2016, 5, 6));
        }
        

        public static IKeyMapper<WeightKey, InternalUrl> SampleMap()
        {
            var map = new KeyMapper<WeightKey, InternalUrl>();
            map.Add(CreateExternalKey(), CreateInternalKey());
            map.Add(CreateExternalKey2(), CreateInternalKey2());
            return map;
        }

        public static IKeyMapper<WeightKey, InternalUrl> SampleLogicalMap()
        {
            var keyMap1 = new KeyMapItem<string, string>("trading", "index.A");
            var l = new List<KeyMapItem<string, string>>();
            l.Add(keyMap1);
            var map = new UrlMapper(l);
            return map;
        }
    }
}

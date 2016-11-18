using APIDataTypes.Keys;
using APIDataTypes.Values;
using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;
using DictionaryRetriever;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CacheDataRetrievers
{
    public static class SampleData
    {
        public static IDataLayer<int, Record<int, string>> SampleNames()
        {
            //var f = new Func<Record<int, string>, int>((r) => { return r.; });
            var l = new List<Record<int, string>>();
            l.Add(new Record<int, string>(1, "Paul"));
            l.Add(new Record<int, string>(5, "Emma"));
            return new DictionaryData<int, Record<int, string>>(l.ToDictionary((r) => { return r.Key; }), (r) => { return r.Key; });
        }

        public static IDictionary<WeightsKey, WeightsData> SampleWeights()
        {
            List<WeightsData> weights = new List<WeightsData>();
            return weights.ToDictionary((v) => { return new WeightsKey(v.IndexName, v.Category, v.Owner, v.BusinessDate); });
        }
    }
}

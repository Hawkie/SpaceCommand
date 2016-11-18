using APIDataTypes.Keys;
using APIDataTypes.Values;
using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APIInterfaces.SystemTypes;
using DictionaryRetriever;

namespace CacheDataRetrievers
{
    public class WeightsRetriever : DictionaryData<WeightsKey, WeightsData> , IDataLayer<WeightsKey, WeightsData>
    {
        public WeightsRetriever(IDictionary<WeightsKey, WeightsData> dataObjects, Func<WeightsData, WeightsKey> keyGen) : base(dataObjects, keyGen)
        {
        }

        
    }
}

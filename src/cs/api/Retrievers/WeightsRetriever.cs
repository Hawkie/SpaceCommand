using API.DataTypes.Keys;
using API.DataTypes.Values;
using API.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Interfaces.SystemTypes;
using API.Retrievers.Cache;

namespace API.Retrievers
{
    public class WeightsRetriever : DictionaryRetriever<WeightsKey, WeightsData> , IDataLayer<WeightsKey, WeightsData>
    {
        public WeightsRetriever(IDictionary<WeightsKey, WeightsData> dataObjects, Func<WeightsData, WeightsKey> keyGen) : base(dataObjects, keyGen)
        {
        }

        
    }
}
